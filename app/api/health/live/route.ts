export async function GET(): Promise<Response> {
  return Response.json({ status: 'alive' }, { status: 200 });
}
