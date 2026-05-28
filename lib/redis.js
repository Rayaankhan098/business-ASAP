import { Redis } from '@upstash/redis';

// Returns null gracefully if env vars are not set (local dev without KV)
function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || url === 'your-upstash-url' || token === 'your-upstash-token') {
    return null;
  }
  return new Redis({ url, token });
}

export const redis = getRedis();

export const KV_AVAILABLE = redis !== null;
