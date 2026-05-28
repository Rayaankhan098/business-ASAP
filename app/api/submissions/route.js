export const runtime = 'nodejs';
import { redis, KV_AVAILABLE } from '@/lib/redis';

// GET — fetch all submissions (newest first)
export async function GET() {
  if (!KV_AVAILABLE) {
    return Response.json({ ok: false, kvAvailable: false, submissions: [], message: 'Redis not configured.' });
  }
  try {
    const ids = await redis.lrange('submission_ids', 0, -1);
    if (!ids.length) return Response.json({ ok: true, kvAvailable: true, submissions: [] });

    const submissions = await Promise.all(
      ids.map((id) => redis.get(`submission:${id}`))
    );

    // Filter nulls (deleted records) and return newest first
    return Response.json({
      ok: true,
      kvAvailable: true,
      submissions: submissions.filter(Boolean),
    });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// DELETE — clear all submissions
export async function DELETE() {
  if (!KV_AVAILABLE) {
    return Response.json({ ok: false, message: 'Redis not configured.' });
  }
  try {
    const ids = await redis.lrange('submission_ids', 0, -1);
    if (ids.length) {
      const pipeline = redis.pipeline();
      ids.forEach((id) => pipeline.del(`submission:${id}`));
      pipeline.del('submission_ids');
      await pipeline.exec();
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
