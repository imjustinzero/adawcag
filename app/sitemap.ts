export default function sitemap() {
  return [
    '/',
    '/pricing',
    '/audit',
    '/resources',
    '/government',
    '/enterprise',
    '/law-firms',
    '/healthcare',
    '/restaurants',
    '/ecommerce',
    '/human-testing',
    '/why-not-a-contractor',
  ].map((url) => ({ url: `https://adawcag.org${url}`, lastModified: new Date() }));
}
