/**
 * In-memory rate limiter for review submissions.
 * Maps IP addresses to timestamps of requests.
 * In production, consider using Redis or a dedicated rate-limiting service.
 */

const requestLog = new Map<string, number[]>();

export function getRateLimitKey(request: Request): string {
  // Get client IP from various headers (priority order for different deployment scenarios)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = request.headers.get('cf-connecting-ip'); // Cloudflare

  return forwardedFor?.split(',')[0].trim() || realIp || clientIp || 'unknown';
}

export function checkRateLimit(
  ip: string,
  requestsPerHour: number = 3,
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  // Get or initialize request timestamps for this IP
  let timestamps = requestLog.get(ip) || [];

  // Filter out requests older than 1 hour
  timestamps = timestamps.filter((timestamp) => timestamp > oneHourAgo);

  const allowed = timestamps.length < requestsPerHour;
  const remaining = Math.max(0, requestsPerHour - timestamps.length - (allowed ? 1 : 0));

  // Calculate reset time (when the oldest request expires)
  const resetTime = timestamps.length > 0 ? timestamps[0] + 60 * 60 * 1000 : now;

  // Add current request if allowed
  if (allowed) {
    timestamps.push(now);
  }

  // Update the log
  requestLog.set(ip, timestamps);

  // Cleanup old entries to prevent memory leak (every 100 entries added)
  if (requestLog.size > 1000) {
    for (const [key, times] of requestLog.entries()) {
      const recentTimes = times.filter((t) => t > oneHourAgo);
      if (recentTimes.length === 0) {
        requestLog.delete(key);
      } else {
        requestLog.set(key, recentTimes);
      }
    }
  }

  return {
    allowed,
    remaining,
    resetTime,
  };
}
