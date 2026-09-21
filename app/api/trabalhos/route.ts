import {
  errorResponse,
  listProjects,
  noCache,
  requireAdmin,
  saveProject,
} from '@/lib/portfolio-server';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const all = new URL(request.url).searchParams.get('painel') === '1';
    if (all) await requireAdmin();
    return Response.json(
      { projects: await listProjects(all) },
      { headers: noCache },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
export async function POST(request: Request) {
  try {
    return Response.json(
      { project: await saveProject(request) },
      { status: 201, headers: noCache },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
