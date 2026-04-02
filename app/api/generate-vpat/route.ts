import { NextRequest, NextResponse } from 'next/server';
import { Packer, Document, Paragraph, Table, TableRow, TableCell } from 'docx';
import { supabase } from '@/lib/supabase';
import { inferFixDetails, type ViolationRecord } from '@/lib/accessibility/violation-mapping';


const baselineCriteria: Array<{ number: string; name: string }> = [
  { number: '1.1.1', name: 'Non-text Content' },
  { number: '1.4.3', name: 'Contrast (Minimum)' },
  { number: '2.1.2', name: 'No Keyboard Trap' },
  { number: '3.3.2', name: 'Labels or Instructions' },
  { number: '4.1.2', name: 'Name, Role, Value' },
];

type CriterionLine = {
  criterion_number: string;
  criterion_name: string;
  conformance_level: 'Supports' | 'Partially Supports' | 'Does Not Support' | 'Not Applicable';
  remarks: string;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const scanId = typeof body.scan_id === 'string' ? body.scan_id : '';

  if (!scanId) {
    return NextResponse.json({ error: 'MISSING_SCAN_ID' }, { status: 400 });
  }

  try {
    const { data: scanData, error } = await supabase.from('scans').select('violations').eq('id', scanId).single();
    if (error) {
      return NextResponse.json({ error: 'SCAN_NOT_FOUND', details: error.message }, { status: 404 });
    }

    const violations = (scanData?.violations as ViolationRecord[] | null) ?? [];
    const grouped = new Map<string, { name: string; count: number }>();

    for (const violation of violations) {
      const issueName = violation.issue_name ?? violation.rule_id ?? violation.help ?? 'Unknown issue';
      const mapped = inferFixDetails(issueName);
      const existing = grouped.get(mapped.wcagCriterion);
      grouped.set(mapped.wcagCriterion, { name: mapped.criterionName, count: (existing?.count ?? 0) + 1 });
    }

    const criteriaRows: CriterionLine[] = baselineCriteria.map((criterion) => {
      const meta = grouped.get(criterion.number);
      const count = meta?.count ?? 0;
      const conformance = count === 0 ? 'Supports' : count <= 2 ? 'Partially Supports' : 'Does Not Support';
      return {
        criterion_number: criterion.number,
        criterion_name: meta?.name ?? criterion.name,
        conformance_level: conformance,
        remarks: count > 0 ? `${count} related violations detected in the scanned scope.` : 'No violations detected for this criterion.',
      };
    });

    const vpat = {
      product_info: {
        name: String(body.product_name ?? 'Unknown Product'),
        version: String(body.product_version ?? 'Unknown'),
        company: String(body.company_name ?? 'Unknown Company'),
        evaluation_date: String(body.evaluation_date ?? new Date().toISOString().slice(0, 10)),
        contact_email: String(body.contact_email ?? ''),
      },
      applicable_standards: ['WCAG 2.1 AA', 'Section 508'],
      wcag_criteria: criteriaRows,
    };

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph(`VPAT Report: ${vpat.product_info.name}`),
          new Paragraph(`Version: ${vpat.product_info.version}`),
          new Paragraph(`Company: ${vpat.product_info.company}`),
          new Paragraph(`Evaluation date: ${vpat.product_info.evaluation_date}`),
          new Paragraph('Applicable standards: WCAG 2.1 AA, Section 508'),
          new Table({
            rows: [
              new TableRow({ children: ['Criterion', 'Name', 'Conformance', 'Remarks'].map((cell) => new TableCell({ children: [new Paragraph(cell)] })) }),
              ...criteriaRows.map((line) => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(line.criterion_number)] }),
                  new TableCell({ children: [new Paragraph(line.criterion_name)] }),
                  new TableCell({ children: [new Paragraph(line.conformance_level)] }),
                  new TableCell({ children: [new Paragraph(line.remarks)] }),
                ],
              })),
            ],
          }),
        ],
      }],
    });

    const docBuffer = await Packer.toBuffer(doc);

    await supabase.from('vpat_reports').insert({
      scan_id: scanId,
      product_name: vpat.product_info.name,
      generated_at: new Date().toISOString(),
      file_url: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${docBuffer.toString('base64')}`,
    });

    return NextResponse.json({ vpat, docxBase64: docBuffer.toString('base64') });
  } catch (error) {
    return NextResponse.json({ error: 'VPAT_GENERATION_FAILED', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
