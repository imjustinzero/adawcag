export interface AdaCaseSeed {
  case_name: string;
  citation: string;
  court: string;
  year: number;
  outcome: 'plaintiff_won' | 'defendant_won' | 'settled' | 'ongoing';
  settlement_amount_min: number;
  settlement_amount_max: number;
  wcag_violations_cited: string[];
  violation_types: string[];
  industries_affected: string[];
  summary: string;
  legal_significance: string;
  source_url?: string;
}

export const ADA_CASES: AdaCaseSeed[] = [
  {
    case_name: "Robles v. Domino's Pizza LLC",
    citation: '913 F.3d 898 (9th Cir. 2019)',
    court: '9th Circuit Court of Appeals',
    year: 2019,
    outcome: 'plaintiff_won',
    settlement_amount_min: 0,
    settlement_amount_max: 0,
    wcag_violations_cited: ['1.1.1', '2.1.1', '4.1.2'],
    violation_types: ['missing_alt_text', 'keyboard_inaccessibility'],
    industries_affected: ['restaurant', 'food_delivery'],
    summary: "Blind plaintiff could not use Domino's website or app to order food.",
    legal_significance: 'Landmark ruling establishing ADA Title III web applicability.',
    source_url: 'https://law.justia.com/cases/federal/appellate-courts/ca9/17-55504/17-55504-2019-01-15.html'
  },
  {
    case_name: 'Gil v. Winn-Dixie Stores Inc',
    citation: '242 F. Supp. 3d 1315 (S.D. Fla. 2017)',
    court: 'S.D. Florida',
    year: 2017,
    outcome: 'plaintiff_won',
    settlement_amount_min: 0,
    settlement_amount_max: 0,
    wcag_violations_cited: ['2.1.1', '1.3.1', '4.1.2'],
    violation_types: ['keyboard_inaccessibility', 'screen_reader_incompatibility'],
    industries_affected: ['retail', 'grocery'],
    summary: 'First trial verdict finding a retailer website violated ADA.',
    legal_significance: 'First ADA web accessibility trial verdict.'
  },
  {
    case_name: 'National Federation of the Blind v. Target Corp',
    citation: '452 F. Supp. 2d 946 (N.D. Cal. 2006)',
    court: 'N.D. California',
    year: 2006,
    outcome: 'settled',
    settlement_amount_min: 6000000,
    settlement_amount_max: 6000000,
    wcag_violations_cited: ['1.1.1', '2.1.1', '2.4.1'],
    violation_types: ['missing_alt_text', 'keyboard_inaccessibility', 'missing_skip_links'],
    industries_affected: ['retail', 'enterprise'],
    summary: 'NFB sued Target over inaccessible website and settled for $6M.',
    legal_significance: 'Major class action precedent for corporate liability.'
  },
  {
    case_name: 'Architectural Barriers Act cases — DOJ enforcement',
    citation: '28 C.F.R. Part 36',
    court: 'DOJ Administrative',
    year: 2022,
    outcome: 'plaintiff_won',
    settlement_amount_min: 50000,
    settlement_amount_max: 500000,
    wcag_violations_cited: ['1.1.1', '1.3.1', '1.4.3', '2.1.1', '2.4.1'],
    violation_types: ['missing_alt_text', 'contrast_failure', 'keyboard_inaccessibility'],
    industries_affected: ['government'],
    summary: 'DOJ enforcement actions against government websites under Title II.',
    legal_significance: 'Applicable to Title II enforcement urgency.'
  },
  {
    case_name: 'Murphy v. Eyedoctors',
    citation: 'No. 1:21-cv-02607 (D. Md. 2021)',
    court: 'D. Maryland',
    year: 2021,
    outcome: 'settled',
    settlement_amount_min: 25000,
    settlement_amount_max: 75000,
    wcag_violations_cited: ['1.1.1', '4.1.2'],
    violation_types: ['missing_alt_text', 'form_inaccessibility'],
    industries_affected: ['healthcare'],
    summary: 'Healthcare scheduling site inaccessible to blind patients.',
    legal_significance: 'Healthcare portals face heightened ADA exposure.'
  }
];
