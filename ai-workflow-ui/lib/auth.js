import { timingSafeEqual } from 'node:crypto';

// With APP_PASSWORD set in .env.local, every API call must send it in the
// x-app-password header. Without it, the API only answers on localhost so a
// deployed copy can't be used by strangers to spend Google credit.
export function isAuthorized(request) {
  const expected = process.env.APP_PASSWORD;

  if (!expected) {
    const host = (request.headers.get('host') || '').split(':')[0];
    return host === 'localhost' || host === '127.0.0.1';
  }

  const given = request.headers.get('x-app-password') || '';
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function unauthorized() {
  return Response.json({ error: 'Wrong password.' }, { status: 401 });
}
