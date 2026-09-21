import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { categories, type Project } from '@/lib/portfolio';

type Bindings = { DB: D1Database; PHOTOS: R2Bucket; ADMIN_EMAILS?: string };
export const bindings = () => env as unknown as Bindings;
export const database = () => bindings().DB;
export class RequestError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function isAdmin() {
  const user = await getChatGPTUser();
  const allowed = (bindings().ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return !!user && allowed.includes(user.email.toLowerCase());
}
export async function requireAdmin(request?: Request) {
  if (!(await isAdmin()))
    throw new RequestError(
      'Entre com a conta autorizada para gerenciar os trabalhos.',
      403,
    );
  if (request) {
    const origin = request.headers.get('origin');
    const expected = new URL(request.url).origin;
    if (origin !== expected)
      throw new RequestError('Atualize a página e tente novamente.', 403);
  }
}
type Row = Omit<Project, 'images' | 'published'> & {
  images: string;
  published: number;
};
function decode(row: Row): Project {
  return {
    ...row,
    images: JSON.parse(row.images),
    published: row.published === 1,
  };
}
export async function listProjects(all = false) {
  const query = all
    ? 'SELECT * FROM projects ORDER BY created_at DESC, id DESC'
    : 'SELECT * FROM projects WHERE published = 1 ORDER BY created_at DESC, id DESC';
  const rows = await database().prepare(query).all<Row>();
  return rows.results.map(decode);
}
export async function getProject(id: string) {
  const row = await database()
    .prepare('SELECT * FROM projects WHERE id = ?')
    .bind(id)
    .first<Row>();
  return row ? decode(row) : null;
}
export function errorResponse(error: unknown) {
  if (error instanceof RequestError)
    return Response.json({ error: error.message }, { status: error.status });
  console.error('Portfolio request failed', error);
  return Response.json(
    {
      error:
        'Não foi possível salvar agora. Tente novamente; seus campos continuam preenchidos.',
    },
    { status: 500 },
  );
}
export const noCache = { 'Cache-Control': 'no-store' };
function textField(form: FormData, key: string, fallback = '') {
  const value = form.get(key);
  if (value === null) return fallback;
  if (typeof value !== 'string')
    throw new RequestError('Confira os campos do trabalho.');
  return value;
}
export async function saveProject(request: Request, id?: string) {
  await requireAdmin(request);
  const previous = id ? await getProject(id) : null;
  if (id && !previous) throw new RequestError('Trabalho não encontrado.', 404);
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 26 * 1024 * 1024)
    throw new RequestError('Envie até 6 fotos por trabalho.', 413);
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new RequestError(
      'Não foi possível ler as fotos. Selecione os arquivos novamente.',
    );
  }
  const title = textField(form, 'title').trim();
  const category = textField(form, 'category');
  const description = textField(form, 'description').trim();
  const location = textField(form, 'location').trim();
  const published = form.get('published');
  if (title.length < 3 || title.length > 90)
    throw new RequestError('Use um título de 3 a 90 caracteres.');
  if (!(categories as readonly string[]).includes(category))
    throw new RequestError('Selecione uma categoria válida.');
  if (description.length > 700 || location.length > 80)
    throw new RequestError('A descrição ou a localização está longa demais.');
  if (published !== 'true' && published !== 'false')
    throw new RequestError('Escolha como deseja salvar o trabalho.');
  let retained: string[];
  try {
    retained = JSON.parse(textField(form, 'retained', '[]'));
  } catch {
    throw new RequestError('Confira as fotos e tente novamente.');
  }
  if (
    !Array.isArray(retained) ||
    retained.some(
      (key) => typeof key !== 'string' || !previous?.images.includes(key),
    )
  )
    throw new RequestError('Uma das fotos não pertence a este trabalho.');
  retained = [...new Set(retained)];
  const files = form
    .getAll('photos')
    .filter((file): file is File => typeof file !== 'string' && file.size > 0);
  if (retained.length + files.length < 1 || retained.length + files.length > 6)
    throw new RequestError('Adicione entre 1 e 6 fotos.');
  const validated: { bytes: ArrayBuffer; type: string; key: string }[] = [];
  for (const file of files) {
    if (file.size > 4 * 1024 * 1024)
      throw new RequestError(
        'Cada foto deve ter até 4 MB após a preparação.',
        413,
      );
    const bytes = await file.arrayBuffer();
    const head = new Uint8Array(bytes);
    const jpeg = head[0] === 255 && head[1] === 216 && head[2] === 255;
    const png = [137, 80, 78, 71, 13, 10, 26, 10].every(
      (n, i) => head[i] === n,
    );
    const webp =
      new TextDecoder().decode(head.slice(0, 4)) === 'RIFF' &&
      new TextDecoder().decode(head.slice(8, 12)) === 'WEBP';
    if (!jpeg && !png && !webp)
      throw new RequestError('Envie fotos JPG, PNG ou WebP.');
    const ext = jpeg ? 'jpg' : png ? 'png' : 'webp';
    validated.push({
      bytes,
      type: `image/${jpeg ? 'jpeg' : ext}`,
      key: `${crypto.randomUUID()}.${ext}`,
    });
  }
  const stored: string[] = [];
  const projectId = id || crypto.randomUUID();
  const now = new Date().toISOString();
  try {
    for (const photo of validated) {
      await bindings().PHOTOS.put(photo.key, photo.bytes, {
        httpMetadata: { contentType: photo.type },
      });
      stored.push(photo.key);
    }
    const images = JSON.stringify([...retained, ...stored]);
    if (previous) {
      const result = await database()
        .prepare(
          'UPDATE projects SET title = ?, category = ?, description = ?, location = ?, images = ?, published = ?, updated_at = ? WHERE id = ? AND updated_at = ?',
        )
        .bind(
          title,
          category,
          description,
          location,
          images,
          published === 'true' ? 1 : 0,
          now,
          projectId,
          textField(form, 'updated_at'),
        )
        .run();
      if (!result.meta.changes)
        throw new RequestError(
          'Este trabalho mudou em outra janela. Atualize a lista antes de editar novamente.',
          409,
        );
    } else {
      await database()
        .prepare(
          'INSERT INTO projects (id, title, category, description, location, images, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        )
        .bind(
          projectId,
          title,
          category,
          description,
          location,
          images,
          published === 'true' ? 1 : 0,
          now,
          now,
        )
        .run();
    }
  } catch (error) {
    await Promise.allSettled(
      stored.map((key) => bindings().PHOTOS.delete(key)),
    );
    throw error;
  }
  // Old photos remain recoverable in storage, but are inaccessible once detached.
  return getProject(projectId);
}
