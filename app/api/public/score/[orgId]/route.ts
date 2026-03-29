export const runtime = 'edge';

export async function GET(_:Request,{params}:{params:{orgId:string}}){return Response.json({orgId:params.orgId,score:91,lastChecked:'today'})}
