import { NextResponse } from 'next/server';
import { reportPdfUrls } from '@/lib/server/runtime-store';

export async function GET(_: Request, context: { params: { id: string } }): Promise<NextResponse> {
  const pdfUrl = reportPdfUrls.get(context.params.id);
  if (!pdfUrl) {
    return NextResponse.json({ error: 'PDF_NOT_READY' }, { status: 404 });
  }

  return NextResponse.json({ reportId: context.params.id, pdfUrl });
}
