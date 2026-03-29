export async function GET(): Promise<Response> {
  return Response.json({ status: 'ready' }, { status: 200 });
}
