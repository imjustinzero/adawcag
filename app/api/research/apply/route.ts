import { NextRequest, NextResponse } from 'next/server';
import { submitResearchApplication } from '@/lib/research/data';

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';
  const payload: Record<string, string> = contentType.includes('application/json')
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries()) as Record<string, string>;

  const app = submitResearchApplication({
    institution: payload.institution,
    department: payload.department,
    principalInvestigator: payload.principalInvestigator,
    email: payload.email,
    researchQuestion: payload.researchQuestion,
    datasets: (payload.datasets ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    methodsOverview: payload.methodsOverview,
    expectedOutputs: payload.expectedOutputs,
    irbApprovalNumber: payload.irbApprovalNumber,
    dataHandlingPlan: payload.dataHandlingPlan,
  });

  return NextResponse.json({ status: 'submitted', applicationId: app.id }, { status: 201 });
}
