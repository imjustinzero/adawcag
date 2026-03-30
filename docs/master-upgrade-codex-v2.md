# ADAWCAG.org — Master Upgrade Codex

**Version 2.0 | UAIU Holdings Corp | Confidential**  
*Built to dominate CivicPlus and every accessibility overlay tool in the market*

---

## Section 1 — Current Competitive Advantages (Protect These)

These are live, real, and defensible today. Never let a sales call end without naming all six.

| Advantage | What It Means | CivicPlus Has It? |
|---|---|---|
| DHS Trusted Tester (Aaron Espinoza) | Certified blind tester validates what no bot can | ❌ |
| VPAT / ACR Generation | Legal conformance document, client’s actual shield | ❌ |
| Real-Time Monitoring | Continuous scanning, alerts on regression | ❌ |
| Full Ecosystem Scanning | PDFs, subdomains, third-party embeds, iframes | ❌ |
| Remediation Dashboard | Score, queue, workflow — not a ticket system | ❌ |
| Auto-Certification at 85+ | Timestamped, documented, defensible | ❌ |

---

## Section 2 — The 7 Moat Builders

### 🔴 Priority 1 — Accessibility Statement Generator

**What it is:** Auto-generated, legally defensible public accessibility statement tied to live scan data. Updates dynamically as compliance score changes.

**Why it wins:** Every public entity is required by DOJ guidance to publish one. Almost none do it correctly. This is a 1-click deliverable for the client.

**Build spec:**

- Pull live axe-core/pa11y score from scan engine
- Populate statement template: conformance level, known limitations, contact method, last reviewed date
- Auto-update timestamp on every scan cycle
- Export as HTML embed (drop into any CivicPlus site) + PDF version
- Client dashboard shows “Statement Live ✅” or “Statement Outdated ⚠️”

**Tech:** Templating engine + scan data API hook. 2–3 day build in Replit/Codex.

**Pricing:** Included in Pro tier. Upsell: $199/yr “Certified Statement” with Aaron’s signature on it.

### 🔴 Priority 2 — Complaints & Accessibility Feedback Widget

**What it is:** Branded embeddable widget for client websites. Disabled users click to report accessibility issues. You capture, log, route to remediation queue, close the loop with documentation.

**Why it wins:** DOJ guidance specifically recommends agencies have a feedback mechanism. CivicPlus has zero version of this. It’s a compliance requirement dressed as a feature.

**Build spec:**

- Lightweight JS embed (like a chat widget, accessibility-first)
- User submits: page URL, issue description, assistive tech used
- Auto-creates ticket in ADAWCAG.org remediation queue
- Client gets notification + SLA timer starts
- Resolution logged with timestamp → feeds into Annual Attestation Letter
- WCAG 2.1 AA compliant widget

**Tech:** JS widget + webhook to dashboard. 3–4 day build.

**Pricing:** Add-on at $49/mo or included in Government tier.

### 🟡 Priority 3 — PDF Remediation Pipeline (90/10 Model)

**The model:** ADAWCAG.org automates 90%. Human partner (Aligotech) finalizes 10%. Aaron signs off. Certificate issues.

**What your AI engine handles automatically:**

- Document structure tagging (H1–H6, paragraphs, lists)
- Reading order correction (single-column and standard layouts)
- Alt text generation via vision AI for images
- Language attribute detection and population
- Metadata: title, author, subject, language
- Pre-remediation WCAG scan (identify all failures)
- Post-remediation WCAG scan (confirm pass rate)
- Confidence scoring per element (flags low-confidence for human)

**What human review handles (the 10%):**

- Low-confidence tagged elements
- Complex/merged table structures
- Interactive form fields, tab order, error messages
- Scanned/OCR-dependent pages
- Final read-through with screen reader
- Aaron blind tester sign-off before certificate issues

**Partnership structure with Aligotech:**

- White-label subcontractor; client does not see partner branding
- Send pre-tagged PDF; partner finalizes flagged elements only
- Pay per-page for human review only (~$1–4/page)
- NDA + subcontractor agreement before first transfer
- Aaron performs final certification; certificate is ADAWCAG.org branded

**Pricing model:**

| Document Type | Client Price | Your Cost | Margin |
|---|---:|---:|---:|
| Simple text PDF (1–4 pages) | $35 | $5–8 | ~75% |
| Standard form | $75 | $15–20 | ~73% |
| Complex table/layout | $125 | $30–40 | ~68% |
| Scanned/OCR PDF | $150 | $35–45 | ~70% |
| Batch 100+ docs | Custom | Volume discount | 65–70% |

**Revenue potential:** A county with 300 legacy PDFs = $10,500–$45,000 one-time remediation contract on top of SaaS subscription.

**Tech stack:**

- PDF parsing: PyMuPDF or pdfplumber
- AI tagging: Claude API (vision for images, text for structure)
- Confidence scoring: flag anything below 0.85 threshold
- Output: pre-tagged PDF passed to Aligotech queue
- Post-remediation: pa11y PDF scan to validate
- Certificate: auto-generated PDF with Aaron’s credentials + timestamp

**Build timeline:** 2 weeks for MVP pipeline. Partner agreement with Aligotech in parallel.

### 🟡 Priority 4 — Annual Compliance Report & Attestation Letter

**What it is:** A branded, signed annual report a client can hand to their Board of Supervisors, city council, legal counsel, or DOJ if asked.

**Contents:**

- Compliance score trend (12-month chart)
- Issues found and resolved (count + category)
- PDFs remediated
- Feedback complaints received and resolved
- Current VPAT status
- DHS Trusted Tester attestation (Aaron’s signature + credentials)
- ADAWCAG.org CEO signature (Justin)
- Statement: “This site was independently audited and found to conform with WCAG 2.1 AA as of [date]”

**Why it wins:** CivicPlus produces nothing like this. No overlay tool does either. This is the governance document every public entity needs but no vendor gives them.

**Pricing:** $499/yr add-on or included in Enterprise tier.

### 🟢 Priority 5 — Staff Training Module

**What it is:** A short WCAG awareness course for government content editors — the people uploading PDFs, writing alt text, posting news articles every week.

**Why it wins:** The #1 reason compliant sites regress is untrained staff uploading inaccessible content. CivicPlus never trains anyone. You do.

**Format:**

- 4–6 short video modules (15 min total)
- Topics: writing alt text, accessible PDFs, heading structure, link text, color contrast
- Quiz at end → completion certificate
- Tracked in client dashboard: “X of Y staff trained ✅”

**Build approach:** Record with Loom or similar. Host on a simple LMS embed (Teachable, Podia, or custom). Aaron co-presents for credibility.

**Pricing:** $299/yr per agency or $49/seat.

### 🔵 Future — Multilingual Accessibility

**What it is:** WCAG compliance + screen reader compatibility verified in Spanish (and eventually other languages), especially for government sites serving non-English populations.

**Why it wins:** No CMS platform, no overlay tool, no competitor addresses this. It’s a genuine gap in the market and a civil rights issue at scale.

**Build approach:** Partner with a translation vendor. Add Spanish-language screen reader testing to Aaron’s audit protocol. Flag multilingual issues in scan engine.

**Timeline:** Post-April deadline. Build Q2 2026.

### 🔵 Future — CivicPlus White Label / Integration

**The bold play:** Once there are 10–20 government clients with documented results, approach CivicPlus about white-labeling ADAWCAG.org’s compliance layer into their platform.

**Pitch:** “You have 10,000+ government clients who all need what we built. You can’t build it. We already did. Let’s put it inside your platform.”

**Outcome options:**

- Revenue-share integration (preferred)
- Acquisition
- Preferred vendor status across their client base

**Timeline:** Q3–Q4 2026 after proof of scale.

---

## Section 3 — Platform Tier Restructure

| Tier | Price | Includes |
|---|---:|---|
| **Starter** | $149/mo | Scan engine, score, basic dashboard |
| **Pro** | $349/mo | + VPAT, Accessibility Statement, Monitoring, Feedback Widget |
| **Government** | $699/mo | + Annual Attestation Letter, Staff Training, Priority Support |
| **Enterprise** | Custom | + PDF Remediation, Multilingual, Aaron audit, white-glove onboarding |

**PDF Remediation:** Always sold separately as a one-time project fee on top of subscription.

---

## Section 4 — Build Priority Timeline

### Now → April 24 (25 days)

- [ ] Accessibility Statement Generator (3 days)
- [ ] Complaints & Feedback Widget MVP (4 days)
- [ ] Aligotech NDA + subcontractor agreement signed
- [ ] PDF pipeline MVP: AI auto-tag + confidence scoring (7 days)
- [ ] Annual Attestation Letter template (1 day)

### April 25 → June 30

- [ ] PDF pipeline full integration with Aligotech queue
- [ ] Staff Training Module (record + host)
- [ ] Tier restructure live in Stripe
- [ ] Multilingual accessibility scoping

### Q3 2026

- [ ] Multilingual Spanish module live
- [ ] CivicPlus partnership outreach begins
- [ ] 10-client case study package for enterprise sales

---

## Section 5 — One-Liner That Beats CivicPlus

> “CivicPlus builds your website. ADAWCAG.org proves it’s compliant — and keeps proving it, every day, for every page, every PDF, and every user who can’t see your screen.”

---

*ADAWCAG.org | UAIU Holdings Corp | Confidential*  
*Justin Zaragoza, Founder & Executive Chairman*
