const http = require('http');
const { URL } = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const sessions = new Map();

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || '';
  return cookieHeader.split(';').reduce((acc, pair) => {
    const [key, ...rest] = pair.trim().split('=');
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function getSession(req) {
  const cookies = parseCookies(req);
  const sid = cookies.sid;
  if (!sid || !sessions.has(sid)) return null;
  return sessions.get(sid);
}

function createSession(res, data) {
  const sid = crypto.randomUUID();
  sessions.set(sid, data);
  res.setHeader('Set-Cookie', `sid=${sid}; HttpOnly; Path=/; SameSite=Lax`);
}

function destroySession(req, res) {
  const cookies = parseCookies(req);
  if (cookies.sid) {
    sessions.delete(cookies.sid);
  }
  res.setHeader('Set-Cookie', 'sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
}

function sendHtml(res, code, html) {
  res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function pageTemplate(title, body, user = null) {
  const nav = user
    ? `<nav>
         <a href="/dashboard">Dashboard</a>
         ${user.isAdmin ? '<a href="/sales">Sales</a><a href="/enterprise">Enterprise</a>' : ''}
         <a href="/logout">Logout</a>
       </nav>`
    : '';

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; max-width: 900px; }
    nav { margin-bottom: 1rem; display: flex; gap: 1rem; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
    input, textarea, button { display: block; width: 100%; max-width: 500px; margin: 0.5rem 0 1rem; padding: 0.5rem; }
    .tag { display: inline-block; background: #eef; padding: 0.2rem 0.5rem; border-radius: 999px; }
  </style>
</head>
<body>
  ${nav}
  ${body}
</body>
</html>`;
}

function parseForm(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) req.destroy();
    });
    req.on('end', () => {
      const params = new URLSearchParams(data);
      resolve(Object.fromEntries(params.entries()));
    });
  });
}

function csvRowCount(csvText) {
  return csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0).length;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const session = getSession(req);

  if (req.method === 'GET' && url.pathname === '/') {
    if (session) return redirect(res, '/dashboard');
    return sendHtml(
      res,
      200,
      pageTemplate(
        'Login',
        `<h1>Welcome</h1>
         <div class="card">
           <p>Log in with your email. Any <strong>@adawcag.org</strong> account gets admin access.</p>
           <form method="POST" action="/login">
             <label>Email</label>
             <input type="email" name="email" required placeholder="you@example.com" />
             <button type="submit">Login</button>
           </form>
         </div>`
      )
    );
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    const form = await parseForm(req);
    const email = (form.email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return sendHtml(res, 400, pageTemplate('Login Error', '<p>Invalid email.</p><a href="/">Back</a>'));
    }

    const isAdmin = email.endsWith('@adawcag.org');
    createSession(res, { email, isAdmin });
    return redirect(res, '/dashboard');
  }

  if (req.method === 'GET' && url.pathname === '/logout') {
    destroySession(req, res);
    return redirect(res, '/');
  }

  if (req.method === 'GET' && url.pathname === '/dashboard') {
    if (!session) return redirect(res, '/');

    const adminSection = session.isAdmin
      ? `<div class="card">
           <h2>Admin Features Enabled</h2>
           <p class="tag">@adawcag.org recognized</p>
           <p>You can navigate to:</p>
           <ul>
             <li><a href="/sales">/sales</a> for CSV multi-audit uploads and SMTP embedded login settings.</li>
             <li><a href="/enterprise">/enterprise</a> for enterprise-only content.</li>
           </ul>
         </div>`
      : '<p>You are logged in as a standard user.</p>';

    return sendHtml(
      res,
      200,
      pageTemplate(
        'Dashboard',
        `<h1>Dashboard</h1>
         <p>Logged in as <strong>${session.email}</strong></p>
         ${adminSection}`,
        session
      )
    );
  }

  if (req.method === 'GET' && url.pathname === '/sales') {
    if (!session) return redirect(res, '/');
    if (!session.isAdmin) return sendHtml(res, 403, pageTemplate('Forbidden', '<h1>403 Forbidden</h1>', session));

    return sendHtml(
      res,
      200,
      pageTemplate(
        'Sales Page',
        `<h1>Sales Admin Page</h1>
         <div class="card">
           <h2>CSV Multi-Audit Upload</h2>
           <p>Paste CSV content below to process multiple audits at once.</p>
           <form method="POST" action="/sales/upload">
             <label>CSV Content</label>
             <textarea name="csv" rows="8" placeholder="company,email,website\nExample Inc,owner@example.com,https://example.com"></textarea>
             <button type="submit">Process CSV</button>
           </form>
         </div>

         <div class="card">
           <h2>Embedded SMTP Email Login</h2>
           <p>Use this embedded configuration form for SMTP-based sales email workflows.</p>
           <form method="POST" action="/sales/smtp">
             <label>SMTP Host</label>
             <input name="host" placeholder="smtp.example.com" required />
             <label>SMTP Port</label>
             <input name="port" placeholder="587" required />
             <label>Username</label>
             <input name="username" placeholder="sales@adawcag.org" required />
             <label>Password</label>
             <input type="password" name="password" required />
             <button type="submit">Save SMTP Settings</button>
           </form>
         </div>`,
        session
      )
    );
  }

  if (req.method === 'POST' && url.pathname === '/sales/upload') {
    if (!session) return redirect(res, '/');
    if (!session.isAdmin) return sendHtml(res, 403, pageTemplate('Forbidden', '<h1>403 Forbidden</h1>', session));

    const form = await parseForm(req);
    const csv = form.csv || '';
    const rows = csvRowCount(csv);

    return sendHtml(
      res,
      200,
      pageTemplate(
        'CSV Upload Result',
        `<h1>CSV Processed</h1>
         <p>Detected <strong>${rows}</strong> non-empty CSV rows for audit processing.</p>
         <a href="/sales">Back to sales</a>`,
        session
      )
    );
  }

  if (req.method === 'POST' && url.pathname === '/sales/smtp') {
    if (!session) return redirect(res, '/');
    if (!session.isAdmin) return sendHtml(res, 403, pageTemplate('Forbidden', '<h1>403 Forbidden</h1>', session));

    const form = await parseForm(req);
    const maskedPassword = (form.password || '').replace(/./g, '*');

    return sendHtml(
      res,
      200,
      pageTemplate(
        'SMTP Settings Saved',
        `<h1>SMTP Settings Saved</h1>
         <ul>
           <li>Host: ${form.host || ''}</li>
           <li>Port: ${form.port || ''}</li>
           <li>Username: ${form.username || ''}</li>
           <li>Password: ${maskedPassword}</li>
         </ul>
         <p>(Demo only: settings are not persisted.)</p>
         <a href="/sales">Back to sales</a>`,
        session
      )
    );
  }

  if (req.method === 'GET' && url.pathname === '/enterprise') {
    if (!session) return redirect(res, '/');
    if (!session.isAdmin) return sendHtml(res, 403, pageTemplate('Forbidden', '<h1>403 Forbidden</h1>', session));

    return sendHtml(
      res,
      200,
      pageTemplate(
        'Enterprise',
        `<h1>Enterprise Portal</h1>
         <p>This page is available only for users with <strong>@adawcag.org</strong> admin access.</p>`,
        session
      )
    );
  }

  return sendHtml(res, 404, pageTemplate('Not Found', '<h1>404 Not Found</h1>', session || null));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
