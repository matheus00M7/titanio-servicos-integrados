import {
  database,
  errorResponse,
  getProject,
  noCache,
  RequestError,
  requireAdmin,
  saveProject,
} from '@/lib/portfolio-server';
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, { params }: Context) {
  try {
    return Response.json(
      { project: await saveProject(request, (await params).id) },
      { headers: noCache },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const input = (await request.json()) as {
      published?: unknown;
      updated_at?: unknown;
    };
    if (
      typeof input.published !== 'boolean' ||
      typeof input.updated_at !== 'string'
    )
      throw new RequestError('Estado inválido.');
    const changed = await database()
      .prepare(
        'UPDATE projects SET published = ?, updated_at = ? WHERE id = ? AND updated_at = ?',
      )
      .bind(
        input.published ? 1 : 0,
        new Date().toISOString(),
        id,
        input.updated_at,
      )
      .run();
    if (!changed.meta.changes)
      throw new RequestError(
        'Atualize a lista: este trabalho foi alterado em outra janela.',
        409,
      );
    return Response.json(
      { project: await getProject(id) },
      { headers: noCache },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
