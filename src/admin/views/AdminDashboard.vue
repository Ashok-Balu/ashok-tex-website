<template>
  <div class="dashboard-shell space-y-6 pb-8">
    <header class="dashboard-hero">
      <div class="dashboard-hero__glow"></div>
      <div class="dashboard-hero__orb dashboard-hero__orb--one"></div>
      <div class="dashboard-hero__orb dashboard-hero__orb--two"></div>

      <div class="dashboard-hero__content">
        <div>
          <p class="dashboard-kicker">Ashok Tex / Control room</p>
          <h1>Good to see you, {{ userName }}.</h1>
        </div>

        <div class="dashboard-badges">
          <span>Live</span>
          <span class="is-soft">Ready</span>
        </div>
      </div>

      <p class="dashboard-subtitle">
        Keep the catalogue fresh, surface your strongest fabrics, and stay close to every buyer conversation.
      </p>
    </header>

    <p v-if="loadError" class="dashboard-error">{{ loadError }}</p>

    <section v-if="stats" class="metric-grid">
      <div v-for="card in cards" :key="card.label" class="metric-card">
        <div class="metric-card__top">
          <div>
            <p class="metric-card__value">{{ card.value }}</p>
            <p class="metric-card__label">{{ card.label }}</p>
          </div>
          <div :class="['metric-card__icon', card.iconBg]">
            <component :is="card.icon" :class="['h-5 w-5', card.color]" />
          </div>
        </div>
        <div :class="['metric-card__bar', card.bar]"></div>
      </div>
    </section>

    <section v-if="stats" class="analytics-grid">
      <div class="panel panel--wide">
        <div class="panel__header">
          <div>
            <p class="panel__eyebrow">Website traffic</p>
            <h2>Visitors overview</h2>
          </div>
          <div class="panel__icon panel__icon--purple">
            <Users class="h-5 w-5" />
          </div>
        </div>

        <div class="stats-row">
          <div class="mini-stat mini-stat--purple">
            <span>Unique visitors</span>
            <strong>{{ stats.visitors.totalVisitors }}</strong>
          </div>
          <div class="mini-stat mini-stat--green">
            <span>Today</span>
            <strong>{{ stats.visitors.visitsToday }}</strong>
          </div>
          <div class="mini-stat mini-stat--amber">
            <span>Last 30 days</span>
            <strong>{{ stats.visitors.visitsThisMonth }}</strong>
          </div>
        </div>

        <div v-if="chartData.length" class="chart-wrap">
          <div class="chart-head">
            <span>Last 7 days</span>
            <small>{{ stats.visitors.totalVisitors }} visitors</small>
          </div>
          <div class="chart-surface">
            <div class="chart-bars" aria-label="Visitor count for the last seven days">
              <div v-for="day in chartData" :key="day.date" class="chart-bar-group">
                <div class="chart-bar-track">
                  <div class="chart-bar" :style="{ height: `${Math.max(day.visitors ? (day.visitors / maxChartVisitors) * 100 : 4, 4)}%` }" :title="`${day.visitors} visitors`"></div>
                </div>
                <span>{{ day.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="stats.visitors.topPages?.length" class="top-pages">
          <div class="top-pages__label">Top pages</div>
          <ul>
            <li v-for="page in stats.visitors.topPages" :key="page.path">
              <span>{{ page.path || '/' }}</span>
              <strong>{{ page.visits }}</strong>
            </li>
          </ul>
        </div>
      </div>

    </section>

    <div v-if="stats" class="insights-columns">
      <div class="insights-column">
      <div class="panel">
        <div class="panel__header">
          <div>
            <p class="panel__eyebrow">Traffic sources</p>
            <h2>Top pages</h2>
          </div>
          <div class="panel__icon panel__icon--purple">
            <BarChart3 class="h-5 w-5" />
          </div>
        </div>

        <div class="detail-list">
          <div v-for="page in (stats.visitors.topPages || []).slice(0, 5)" :key="page.path" class="detail-row">
            <span>{{ page.path || '/' }}</span>
            <strong>{{ page.visits }}</strong>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel__header">
          <div>
            <p class="panel__eyebrow">Referrals</p>
            <h2>Traffic sources</h2>
          </div>
          <div class="panel__icon panel__icon--brand">
            <ArrowUpRight class="h-5 w-5" />
          </div>
        </div>

        <div class="detail-list">
          <div v-for="source in (stats.visitors.referrerStats || []).slice(0, 5)" :key="source.source" class="detail-row">
            <span>{{ source.source }}</span>
            <strong>{{ source.visits }}</strong>
          </div>
        </div>
      </div>

      <section v-if="stats" class="panel panel--table">
        <div class="panel__header panel__header--table">
          <div>
            <p class="panel__eyebrow">Catalogue pulse</p>
            <h2>Most viewed products</h2>
          </div>
          <div class="panel__icon panel__icon--brand">
            <TrendingUp class="h-5 w-5" />
          </div>
        </div>

        <div class="table-shell">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th class="text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in stats.mostViewed" :key="p.id">
                <td>
                  <div class="product-name">
                    <span class="product-rank">{{ stats.mostViewed.indexOf(p) + 1 }}</span>
                    <span>{{ p.name }}</span>
                  </div>
                </td>
                <td class="text-right product-views">{{ p.view_count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      </div>
      <div class="insights-column">
      <div class="panel">
        <div class="panel__header">
          <div>
            <p class="panel__eyebrow">Recent activity</p>
            <h2>Visitor log</h2>
          </div>
          <div class="panel__icon panel__icon--orange">
            <Users class="h-5 w-5" />
          </div>
        </div>

        <div class="visitor-list">
          <div v-for="visitor in (stats.visitors.recentVisitors || []).slice(0, 5)" :key="visitor.sessionId" class="visitor-item">
            <div class="visitor-item__top">
              <span class="visitor-tag">{{ visitor.browser }}</span>
              <span class="visitor-tag visitor-tag--muted">{{ visitor.device }}</span>
            </div>
            <div class="visitor-item__meta">
              <strong>{{ visitor.path || '/' }}</strong>
              <small>{{ formatDate(visitor.visitedAt) }}</small>
            </div>
            <div class="visitor-item__source">
              <span>{{ visitor.source || 'Direct' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel audience-panel">
        <div class="panel__header">
          <div>
            <p class="panel__eyebrow">Audience mix</p>
            <h2>Browsers</h2>
          </div>
          <div class="panel__icon panel__icon--purple">
            <Eye class="h-5 w-5" />
          </div>
        </div>

        <div class="detail-list">
          <div v-for="browser in (stats.visitors.browserStats || []).slice(0, 5)" :key="browser.browser" class="detail-row">
            <span>{{ browser.browser }}</span>
            <strong>{{ browser.visits }}</strong>
          </div>
        </div>

        <div class="audience-breakdown">
          <p class="audience-breakdown__label">Devices &amp; platforms</p>
          <div class="audience-breakdown__grid">
            <div v-for="device in (stats.visitors.deviceStats || []).slice(0, 2)" :key="`device-${device.device}`" class="audience-breakdown__item">
              <span>{{ device.device }}</span>
              <strong>{{ device.visits }}</strong>
            </div>
            <div v-for="platform in (stats.visitors.platformStats || []).slice(0, 2)" :key="`platform-${platform.platform}`" class="audience-breakdown__item">
              <span>{{ platform.platform }}</span>
              <strong>{{ platform.visits }}</strong>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>

    <div class="action-row">
      <router-link :to="{ name: 'AdminProductNew' }" class="action-button action-button--primary">Add product <ArrowUpRight class="h-4 w-4" /></router-link>
      <router-link :to="{ name: 'AdminCategories' }" class="action-button action-button--secondary">Manage categories <ArrowUpRight class="h-4 w-4" /></router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ArrowUpRight, BarChart3, CheckCircle2, Eye, FolderTree, Inbox, Package, Star, TrendingUp, Users } from 'lucide-vue-next';
import { adminApi } from '../../services/api';
import { useAdminAuth } from '../../composables/useAdminAuth';

const stats = ref(null);
const cards = ref([]);
const loadError = ref('');

const formatDate = (value) => {
  if (!value) return 'Just now';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Just now' : date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const buildEmptyVisitorTrend = () => {
  const labels = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      date: date.toISOString().slice(0, 10),
      visitors: 0,
    };
  });

  return labels.map((item) => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visitors: 0,
  }));
};

const chartData = computed(() => {
  const trend = stats.value?.visitors?.dailyTrend;
  if (trend?.length) {
    return trend.map((day) => ({
      name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: Number(day.visitors || 0),
    }));
  }

  return buildEmptyVisitorTrend();
});
const maxChartVisitors = computed(() => Math.max(...chartData.value.map((day) => Number(day.visitors || 0)), 1));
const { user } = useAdminAuth();
const userName = user.value?.username || 'there';

onMounted(async () => {
  try {
    const res = await adminApi.dashboard();
    const payload = res.data || {};
    stats.value = {
    ...payload,
    visitors: payload.visitors || {
      totalVisitors: 0,
      visitsToday: 0,
      visitsThisMonth: 0,
      topPages: [],
      referrerStats: [],
      browserStats: [],
      deviceStats: [],
      platformStats: [],
      recentVisitors: [],
      dailyTrend: Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        return { date: date.toISOString().slice(0, 10), visitors: 0 };
      }),
    },
    mostViewed: Array.isArray(payload.mostViewed) && payload.mostViewed.length ? payload.mostViewed : [
      { id: 1, name: 'No product views yet', view_count: 0 },
      { id: 2, name: 'Publish products to start tracking traffic', view_count: 0 },
      { id: 3, name: 'Your top products will appear here', view_count: 0 },
    ],
    };

    cards.value = [
        { label: 'Website Visitors', value: stats.value.visitors.totalVisitors, icon: Users, color: 'text-violet-500', iconBg: 'bg-violet-100', bar: 'bg-gradient-to-r from-violet-500 to-purple-400' },
        { label: 'Total Products', value: stats.value.totalProducts, icon: Package, color: 'text-brand-500', iconBg: 'bg-brand-100', bar: 'bg-gradient-to-r from-brand-500 to-orange-400' },
      { label: 'Published Products', value: stats.value.publishedProducts, icon: Eye, color: 'text-emerald-500', iconBg: 'bg-emerald-100', bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400' },
      { label: 'Featured Products', value: stats.value.featuredProducts, icon: Star, color: 'text-amber-500', iconBg: 'bg-amber-100', bar: 'bg-gradient-to-r from-amber-500 to-yellow-400' },
      { label: 'Total Categories', value: stats.value.totalCategories, icon: FolderTree, color: 'text-sky-500', iconBg: 'bg-sky-100', bar: 'bg-gradient-to-r from-sky-500 to-cyan-400' },
      { label: 'Total Testimonials', value: stats.value.totalTestimonials, icon: CheckCircle2, color: 'text-violet-500', iconBg: 'bg-violet-100', bar: 'bg-gradient-to-r from-violet-500 to-purple-400' },
      { label: 'Total Enquiries', value: stats.value.totalEnquiries, icon: Inbox, color: 'text-orange-500', iconBg: 'bg-orange-100', bar: 'bg-gradient-to-r from-orange-500 to-rose-400' },
      { label: 'New Enquiries', value: stats.value.newEnquiries, icon: BarChart3, color: 'text-rose-500', iconBg: 'bg-rose-100', bar: 'bg-gradient-to-r from-rose-500 to-pink-400' },
    ];
  } catch (error) {
    loadError.value = error.message || 'Unable to load dashboard data.';
  }
});
</script>

<style scoped>
.dashboard-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-hero {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1.4rem 1.5rem 1.5rem;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 38%, #fed7aa 100%);
  box-shadow: 0 22px 40px rgba(15, 23, 42, 0.18);
}

.dashboard-hero__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(251, 146, 60, 0.16), transparent 30%);
}

.dashboard-hero__orb {
  position: absolute;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.09);
  backdrop-filter: blur(6px);
}

.dashboard-hero__orb--one {
  right: -3rem;
  top: -3.5rem;
  width: 12rem;
  height: 12rem;
}

.dashboard-hero__orb--two {
  left: 55%;
  bottom: -5rem;
  width: 14rem;
  height: 14rem;
  opacity: 0.75;
}

.dashboard-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.dashboard-kicker {
  margin: 0;
  font-size: 0.68rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(251, 191, 36, 0.9);
  font-weight: 700;
}

.dashboard-hero h1 {
  margin-top: 0.8rem;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1.04;
  letter-spacing: -0.04em;
  color: #431407;
}

.dashboard-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.dashboard-badges span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  background: rgba(255,255,255,0.62);
  color: #9a3412;
  border: 1px solid rgba(194,65,12,0.12);
}

.dashboard-badges .is-soft {
  background: rgba(251, 146, 60, 0.12);
  color: #c2410c;
  border-color: rgba(251, 146, 60, 0.25);
}

.dashboard-subtitle {
  position: relative;
  z-index: 1;
  margin: 1rem 0 0;
  max-width: 42rem;
  color: rgba(124,45,18,0.72);
  font-size: 0.96rem;
  line-height: 1.7;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.metric-card {
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(226,232,240,0.9);
  border-radius: 20px;
  padding: 0.85rem 0.9rem 0.75rem;
  box-shadow: 0 18px 24px rgba(15, 23, 42, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 36px rgba(15, 23, 42, 0.07);
}

.metric-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.metric-card__value {
  margin: 0;
  font-size: clamp(1.6rem, 2vw, 2.2rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: #0f172a;
}

.metric-card__label {
  margin-top: 0.35rem;
  overflow: hidden;
  font-size: 0.63rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 0.85rem;
}

.metric-card__bar {
  margin-top: 0.7rem;
  width: 100%;
  height: 0.38rem;
  border-radius: 999px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.panel {
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(226,232,240,0.9);
  border-radius: 28px;
  box-shadow: 0 18px 28px rgba(15, 23, 42, 0.04);
  padding: 1.2rem 1.2rem 1.25rem;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.panel__eyebrow {
  margin: 0;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7c3aed;
  font-weight: 800;
}

.panel__header h2 {
  margin-top: 0.4rem;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.5rem, 2vw, 2.1rem);
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: #0f172a;
}

.panel__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 0.9rem;
}

.panel__icon--purple { background: #eef2ff; color: #4f46e5; }
.panel__icon--orange { background: #fff7ed; color: #f97316; }
.panel__icon--brand { background: #fff7ed; color: #ea580c; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.mini-stat {
  border-radius: 1.1rem;
  padding: 1rem 1rem 0.9rem;
  border: 1px solid transparent;
}

.mini-stat span {
  display: block;
  font-size: 0.64rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 700;
}

.mini-stat strong {
  display: block;
  margin-top: 0.75rem;
  font-size: clamp(1.7rem, 2vw, 2.4rem);
  letter-spacing: -0.06em;
  color: #0f172a;
}

.mini-stat--purple { background: #eef2ff; border-color: #dfe4ff; }
.mini-stat--purple span { color: #4f46e5; }
.mini-stat--green { background: #ecfdf5; border-color: #d1fae5; }
.mini-stat--green span { color: #059669; }
.mini-stat--amber { background: #fff7ed; border-color: #fde7c7; }
.mini-stat--amber span { color: #c17d13; }

.chart-wrap {
  margin-top: 1.4rem;
}

.chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.62rem;
  font-weight: 700;
}

.chart-surface {
  height: 13.5rem;
  padding: 0.4rem 0.25rem 0.1rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: linear-gradient(180deg, rgba(124, 106, 252, 0.04), rgba(255, 255, 255, 0.6));
}

.chart-surface .recharts-responsive-container {
  width: 100% !important;
  height: 100% !important;
}

.chart-bars {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: 0.75rem;
  height: 100%;
}

.chart-bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  height: 100%;
}

.chart-bar-track {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  min-height: 8rem;
  padding-top: 0.75rem;
  border-bottom: 1px solid #dfe7f5;
}

.chart-bar {
  width: 100%;
  min-height: 0.3rem;
  border-radius: 0.6rem 0.6rem 0.2rem 0.2rem;
  background: linear-gradient(180deg, #7c6afc, #a78bfa);
  transition: height 220ms ease;
}

.chart-bar-group > span {
  overflow: hidden;
  width: 100%;
  color: #64748b;
  font-size: 0.62rem;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-pages {
  margin-top: 1.3rem;
}

.top-pages__label {
  margin-bottom: 0.65rem;
  font-size: 0.64rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
}

.top-pages ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.top-pages li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.7rem 0.75rem;
  border-radius: 0.9rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #0f172a;
}

.top-pages li span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.top-pages li strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  padding: 0.3rem 0.5rem;
  border-radius: 9999px;
  background: white;
  border: 1px solid #e2e8f0;
  font-size: 0.7rem;
}

.summary-stack {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.summary-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-radius: 1.1rem;
  padding: 1rem 1rem 0.95rem;
  border: 1px solid transparent;
}

.summary-card span {
  display: inline-block;
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
}

.summary-card strong {
  font-size: 1.7rem;
  letter-spacing: -0.06em;
  color: #0f172a;
}

.summary-card--brand { background: #fff7ed; border-color: #fed7aa; }
.summary-card--brand span { color: #ea580c; }
.summary-card--green { background: #ecfdf5; border-color: #bbf7d0; }
.summary-card--green span { color: #059669; }
.summary-card--rose { background: #fff1f2; border-color: #fecdd3; }
.summary-card--rose span { color: #e11d48; }

.insights-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;
}

.insights-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;
}

.insights-column {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
}

.insights-grid--secondary {
  margin-top: -0.25rem;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.78rem 0.85rem;
  border-radius: 0.9rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.detail-row span {
  color: #334155;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.detail-row strong {
  font-size: 0.8rem;
  color: #0f172a;
}

.audience-breakdown {
  margin-top: 1rem;
  padding-top: 0.9rem;
  border-top: 1px solid #e2e8f0;
}

.audience-breakdown__label {
  margin: 0 0 0.65rem;
  color: #7c3aed;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.audience-breakdown__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
}

.audience-breakdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.58rem 0.65rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #f8fafc;
  color: #475569;
  font-size: 0.7rem;
  font-weight: 600;
}

.audience-breakdown__item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.audience-breakdown__item strong {
  color: #0f172a;
  font-size: 0.75rem;
}

.visitor-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.visitor-item {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 1rem;
  padding: 0.8rem 0.9rem;
}

.visitor-item__top,
.visitor-item__meta,
.visitor-item__source {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.55rem;
}

.visitor-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 0.28rem 0.5rem;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.visitor-tag--muted {
  background: #f1f5f9;
  color: #475569;
}

.visitor-item__meta {
  margin-top: 0.7rem;
  align-items: flex-end;
}

.visitor-item__meta strong {
  color: #0f172a;
  font-size: 0.84rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visitor-item__meta small,
.visitor-item__source {
  color: #64748b;
  font-size: 0.7rem;
}

.visitor-item__source {
  justify-content: flex-start;
  margin-top: 0.5rem;
}

.panel--table {
  padding: 1.2rem 1.2rem 0.9rem;
}

.panel__header--table {
  margin-bottom: 1rem;
}

.table-shell {
  overflow-x: auto;
  border-radius: 1.3rem;
  border: 1px solid rgba(226,232,240,0.9);
}

.table-shell table {
  width: 100%;
  border-collapse: collapse;
  min-width: 420px;
}

.table-shell thead {
  background: #fff7ed;
  color: rgba(255,255,255,0.85);
}

.table-shell th,
.table-shell td {
  padding: 0.9rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.table-shell th {
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
}

.table-shell tbody tr {
  background: white;
  transition: background 0.2s ease;
}

.table-shell tbody tr:hover {
  background: #fffaf5;
}

.product-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #0f172a;
  font-weight: 600;
}

.product-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 0.7rem;
  background: #f8fafc;
  color: #475569;
  font-size: 0.7rem;
  border: 1px solid #e2e8f0;
}

.product-views {
  font-weight: 700;
  color: #334155;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.25rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.9rem;
  padding: 0.9rem 1.2rem;
  font-size: 0.82rem;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-button:hover {
  transform: translateY(-1px);
}

.action-button--primary {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: white;
  box-shadow: 0 12px 24px rgba(234, 88, 12, 0.2);
}

.action-button--secondary {
  background: white;
  color: #1f2937;
  border: 1px solid rgba(226,232,240,0.9);
}

@media (max-width: 1100px) {
  .metric-grid,
  .insights-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-hero { padding: 1.2rem 1rem 1.2rem; }
  .dashboard-hero__content { flex-direction: column; align-items: flex-start; }
  .dashboard-subtitle { font-size: 0.85rem; }
  .metric-grid,
  .analytics-grid,
  .insights-grid,
  .insights-columns,
  .stats-row { grid-template-columns: 1fr; }
  .chart-bars { min-height: 10rem; }
  .panel--table,
  .audience-panel { height: auto; }
  .action-row { flex-direction: column; }
  .action-button { width: 100%; }
}
</style>

