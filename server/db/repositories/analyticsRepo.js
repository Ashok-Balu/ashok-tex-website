import { collection } from './mongoHelpers.js';
import { describeUserAgent, summarizeReferrer } from '../../utils/visitor.js';

export async function recordVisit({ sessionId, path, referrer, userAgent }) {
  const safeSessionId = String(sessionId || '').trim();
  if (!safeSessionId) return null;
  const visitedDate = new Date().toISOString().slice(0, 10);
  const store = await collection('website_visits');
  const result = await store.updateOne(
    { session_id: safeSessionId, path: path || '/', visited_date: visitedDate },
    { $setOnInsert: { session_id: safeSessionId, path: path || '/', referrer: referrer || '', user_agent: userAgent || '', visited_date: visitedDate, visited_at: new Date() } },
    { upsert: true }
  );
  return result.upsertedId ? store.findOne({ _id: result.upsertedId }) : null;
}

export async function getVisitorStats() {
  const store = await collection('website_visits');
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const monthStart = new Date(now);
  monthStart.setDate(now.getDate() - 30);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);

  const [all, todayRows, monthRows, weekRows] = await Promise.all([
    store.find({}, { projection: { session_id: 1, path: 1, referrer: 1, user_agent: 1, visited_date: 1, visited_at: 1 } }).toArray(),
    store.find({ visited_date: today }, { projection: { session_id: 1 } }).toArray(),
    store.find({ visited_at: { $gte: monthStart } }, { projection: { session_id: 1 } }).toArray(),
    store.find({ visited_at: { $gte: weekStart } }).toArray(),
  ]);

  const pageCounts = new Map();
  const referrerCounts = new Map();
  const browserCounts = new Map();
  const deviceCounts = new Map();
  const platformCounts = new Map();
  const daily = new Map();

  for (const row of weekRows) {
    const page = row.path || '/';
    const ref = summarizeReferrer(row.referrer || '');
    const summarizedUserAgent = describeUserAgent(row.user_agent || '');

    pageCounts.set(page, (pageCounts.get(page) || 0) + 1);
    referrerCounts.set(ref.source, (referrerCounts.get(ref.source) || 0) + 1);
    browserCounts.set(summarizedUserAgent.browser, (browserCounts.get(summarizedUserAgent.browser) || 0) + 1);
    deviceCounts.set(summarizedUserAgent.device, (deviceCounts.get(summarizedUserAgent.device) || 0) + 1);
    platformCounts.set(summarizedUserAgent.platform, (platformCounts.get(summarizedUserAgent.platform) || 0) + 1);

    if (!daily.has(row.visited_date)) daily.set(row.visited_date, new Set());
    daily.get(row.visited_date).add(row.session_id);
  }

  const recentVisitors = [...all]
    .sort((a, b) => new Date(b.visited_at || b.visited_date) - new Date(a.visited_at || a.visited_date))
    .slice(0, 8)
    .map((row) => {
      const summary = describeUserAgent(row.user_agent || '');
      const ref = summarizeReferrer(row.referrer || '');
      return {
        sessionId: row.session_id,
        path: row.path || '/',
        referrer: row.referrer || '',
        source: ref.source,
        browser: summary.browser,
        device: summary.device,
        platform: summary.platform,
        visitedAt: row.visited_at || row.visited_date,
      };
    });

  return {
    totalVisitors: new Set(all.map((row) => row.session_id)).size,
    visitsToday: new Set(todayRows.map((row) => row.session_id)).size,
    visitsThisMonth: new Set(monthRows.map((row) => row.session_id)).size,
    topPages: [...pageCounts]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10)
      .map(([path, visits]) => ({ path, visits })),
    referrerStats: [...referrerCounts]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([source, visits]) => ({ source, visits })),
    browserStats: [...browserCounts]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([browser, visits]) => ({ browser, visits })),
    deviceStats: [...deviceCounts]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([device, visits]) => ({ device, visits })),
    platformStats: [...platformCounts]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([platform, visits]) => ({ platform, visits })),
    recentVisitors,
    dailyTrend: [...daily.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, visitors]) => ({ date, visitors: visitors.size })),
  };
}
