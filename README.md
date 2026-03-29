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
