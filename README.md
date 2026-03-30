# adawcag site

## Run

```bash
npm start
```

Then open `http://localhost:3000`.

## Behavior

- Users who log in with an email ending in `@adawcag.org` are given admin access.
- Admin users can access:
  - `/sales` for CSV multi-audit processing and embedded SMTP login settings form.
  - `/enterprise` for enterprise-only page.

## City-scale ops env additions

```bash
SLACK_WEBHOOK_URL=
SLACK_OPS_CHANNEL=#adawcag-ops
RESEND_API_KEY=re_xxxxxxxxxxxx
CERTIFICATION_THRESHOLD=85
```

Deprecated (keep in local env files for backward compatibility until cleanup):

```bash
# DEPRECATED: Zoho SMTP legacy vars
# ZOHO_SMTP_HOST=
# ZOHO_SMTP_USER=
# ZOHO_SMTP_PASS=
```

Resend setup reminder:
- Add SPF, DKIM, and DMARC records provided by Resend.
- Verify `adawcag.org` in Resend before production sends.
