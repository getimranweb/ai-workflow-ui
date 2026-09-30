import { isAuthorized, unauthorized } from '@/lib/auth';

export async function POST(request) {
  if (!isAuthorized(request)) return unauthorized();
  return Response.json({ ok: true });
}
