import { query } from '../database.js';

export async function recordVisit({ sessionId, path, referrer, userAgent }) {
  const safeSessionId = String(sessionId || '').trim();
  const safePath = String(path || '/').trim() || '/';
  const safeReferrer = String(referrer || '').trim();
  const safeUserAgent = String(userAgent || '').trim();

  if (!safeSessionId) return null;

  const result = await query(
    `INSERT INTO website_visits (session_id, path, referrer, user_agent, visited_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (session_id, path, visited_date)
     DO NOTHING
     RETURNING id`,
    [safeSessionId, safePath, safeReferrer, safeUserAgent]
  );

  return result.rows[0] || null;
}

export async function getVisitorStats() {
  const [totalUnique, visitsToday, visitsThisMonth, pageStats, dailyTrend] = await Promise.all([
    query('SELECT COUNT(DISTINCT session_id)::int AS count FROM website_visits'),
    query("SELECT COUNT(*)::int AS count FROM website_visits WHERE visited_date = CURRENT_DATE"),
    query("SELECT COUNT(*)::int AS count FROM website_visits WHERE visited_date >= CURRENT_DATE - INTERVAL '30 days'"),
    query(`SELECT path, COUNT(*)::int AS visits
      FROM website_visits
      WHERE visited_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY path
      ORDER BY visits DESC, path ASC
      LIMIT 10`),
    query(`SELECT day, COUNT(DISTINCT session_id)::int AS visitors
      FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day') AS day_series(day)
      LEFT JOIN website_visits ON visited_date = day_series.day
      GROUP BY day_series.day
      ORDER BY day_series.day ASC`),
  ]);

  return {
    totalVisitors: totalUnique.rows[0]?.count ?? 0,
    visitsToday: visitsToday.rows[0]?.count ?? 0,
    visitsThisMonth: visitsThisMonth.rows[0]?.count ?? 0,
    topPages: pageStats.rows.map((row) => ({ path: row.path, visits: Number(row.visits) })),
    dailyTrend: dailyTrend.rows.map((row) => ({
      date: row.day ? new Date(row.day).toISOString().slice(0, 10) : null,
      visitors: Number(row.visitors || 0),
    })),
  };
}
