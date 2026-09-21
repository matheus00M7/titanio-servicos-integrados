import { bindings, database, isAdmin, noCache } from '@/lib/portfolio-server';
export const dynamic = 'force-dynamic';
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(key))
    return new Response('Foto não encontrada', { status: 404 });
  const row = await database()
    .prepare(
      'SELECT projects.published FROM projects, json_each(projects.images) AS image WHERE image.value = ? LIMIT 1',
    )
    .bind(key)
    .first<{ published: number }>();
  if (!row || (!row.published && !(await isAdmin())))
    return new Response('Foto não encontrada', {
      status: 404,
      headers: noCache,
    });
  const object = await bindings().PHOTOS.get(key);
  if (!object) return new Response('Foto não encontrada', { status: 404 });
  return new Response(object.body, {
    headers: {
      ...noCache,
      'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'",
    },
  });
}
