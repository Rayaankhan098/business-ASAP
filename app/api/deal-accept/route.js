export const runtime = 'nodejs';
import { redis, KV_AVAILABLE } from '@/lib/redis';

// PATCH — mark a submission as deal accepted
export async function PATCH(request) {
  if (!KV_AVAILABLE) {
    return Response.json({ ok: false, message: 'Redis not configured.' });
  }
  try {
    const { id } = await request.json();
    if (!id) return Response.json({ ok: false, message: 'Missing id.' }, { status: 400 });

    const submission = await redis.get(`submission:${id}`);
    if (!submission) return Response.json({ ok: false, message: 'Submission not found.' }, { status: 404 });

    const updated = {
      ...submission,
      dealAccepted: true,
      dealAcceptedAt: new Date().toISOString(),
    };
    await redis.set(`submission:${id}`, updated);
    return Response.json({ ok: true, submission: updated });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
