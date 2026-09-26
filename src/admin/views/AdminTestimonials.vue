<template>
  <div class="testimonials-page space-y-6 pb-8">
    <header class="page-hero">
      <div class="hero-copy">
        <p class="eyebrow">Customer love</p>
        <h1>Testimonials</h1>
        <p class="hero-subtitle">Shape the proof behind every Ashok Tex conversation.</p>
      </div>
      <div class="hero-actions">
        <span class="hero-count">{{ publishedTestimonials }} published stories</span>
        <button class="primary-action" @click="openCreate"><v-icon icon="mdi-plus" size="17" /> Add Testimonial</button>
      </div>
    </header>

    <section class="stats-grid">
      <div class="stats-card stats-card--dark">
        <div class="stats-label-row"><span>Total stories</span><span class="stats-pill stats-pill--light">Library</span></div>
        <strong>{{ testimonials.length }}</strong>
      </div>
      <div class="stats-card stats-card--green">
        <div class="stats-label-row"><span>Published</span><span class="stats-pill stats-pill--success">Live</span></div>
        <strong>{{ publishedTestimonials }}</strong>
      </div>
      <div class="stats-card stats-card--gold">
        <div class="stats-label-row"><span>Avg. rating</span><span class="stats-pill stats-pill--warning">Signal</span></div>
        <strong>{{ averageRating }}</strong>
      </div>
    </section>

    <div class="hidden md:block table-shell">
      <v-data-table
        :headers="headers"
        :items="testimonials"
        item-value="id"
        :items-per-page="10"
        :items-per-page-options="[10, 25, 50]"
        class="admin-data-table"
        density="comfortable"
        hover
        items-per-page-text="Testimonials per page"
      >
        <template #top>
          <div class="table-heading">
            <div><p class="table-kicker">Social proof</p><h2>Customer stories</h2><p>{{ testimonials.length }} testimonials in your library</p></div>
            <span class="table-hint">Click a status to publish or hide</span>
          </div>
        </template>
        <template v-slot:[`item.customer_name`]="{ item }">
          <div class="customer-cell"><span class="customer-avatar">{{ customerInitials(item.customer_name) }}</span><span class="customer-copy"><strong>{{ item.customer_name }}</strong><small>{{ item.role || 'Customer' }}</small></span></div>
        </template>
        <template v-slot:[`item.quote`]="{ item }"><span class="quote-cell" :title="item.quote"><span class="quote-mark">“</span>{{ item.quote }}”</span></template>
        <template v-slot:[`item.rating`]="{ item }"><div class="rating-cell"><v-rating :model-value="Number(item.rating)" length="5" readonly density="compact" size="small" active-color="amber-darken-2" /><span>{{ item.rating }}.0</span></div></template>
        <template v-slot:[`item.published`]="{ item }">
          <button :class="['status-pill', item.published ? 'status-pill--success' : 'status-pill--muted']" @click="togglePublish(item)">{{ item.published ? 'Published' : 'Draft' }}</button>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div class="table-actions">
            <v-btn class="testimonial-edit" size="small" variant="tonal" prepend-icon="mdi-pencil-outline" @click="openEdit(item)">Edit</v-btn>
            <v-btn class="testimonial-delete" size="small" variant="text" @click="remove(item)">Delete</v-btn>
          </div>
        </template>
        <template #no-data><div class="empty-table-state">No testimonials yet.</div></template>
      </v-data-table>
    </div>

    <div class="md:hidden space-y-3">
      <div v-for="t in testimonials" :key="t.id" class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-ink-900">{{ t.customer_name }}</p>
            <p class="text-xs text-ink-400 mt-1">{{ t.role || '—' }}</p>
          </div>
          <button :class="['px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap', t.published ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-ink-500']" @click="togglePublish(t)">{{ t.published ? 'Published' : 'Draft' }}</button>
        </div>
        <p class="text-sm text-ink-600 italic line-clamp-3">{{ t.quote }}</p>
        <div class="flex items-center justify-between pt-2 border-t border-slate-200">
          <span class="text-sm font-medium text-ink-700">{{ t.rating }}★</span>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 bg-brand-50 text-brand-600 hover:bg-brand-100 text-xs font-semibold rounded-lg" @click="openEdit(t)">Edit</button>
            <button class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg" @click="remove(t)">Delete</button>
          </div>
        </div>
      </div>
      <div v-if="testimonials.length === 0" class="text-center py-8 text-ink-400">No testimonials yet.</div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-brand-900/20 flex items-center justify-center p-4 z-50 overflow-y-auto" @click.self="showModal = false">
      <div class="bg-white rounded-3xl shadow-float w-full max-w-lg p-4 sm:p-8 my-8 sm:my-0">
        <h2 class="font-display text-xl font-bold text-ink-900 mb-5">{{ editing ? 'Edit Testimonial' : 'New Testimonial' }}</h2>
        <v-form class="space-y-4" @submit.prevent="save">
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Customer Name *</label>
            <input v-model="form.customerName" required class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Role / Company</label>
            <input v-model="form.role" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Quote *</label>
            <textarea v-model="form.quote" rows="3" required class="input-field text-base resize-none"></textarea>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-ink-700 mb-1.5">Rating</label>
              <select v-model.number="form.rating" class="input-field text-base">
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <label class="flex items-center gap-2 text-sm text-ink-700 sm:mt-6">
              <input v-model="form.published" type="checkbox" class="rounded" /> Published
            </label>
          </div>
          <div class="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button type="button" class="w-full sm:flex-1 py-2.5 bg-surface-100 hover:bg-surface-200 text-ink-700 font-semibold rounded-xl text-sm" @click="showModal = false">Cancel</button>
            <button type="submit" class="w-full sm:flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm">Save</button>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { VBtn, VDataTable, VIcon, VRating } from 'vuetify/components';
import { adminApi } from '../../services/api';
import { useAdminConfirm } from '../../composables/useAdminConfirm';

const { confirmAction } = useAdminConfirm();

const testimonials = ref([]);
const showModal = ref(false);
const editing = ref(null);
const form = ref(emptyForm());

const headers = [
  { title: 'Customer', key: 'customer_name', sortable: true, width: '25%' },
  { title: 'Quote', key: 'quote', sortable: false, width: '30%' },
  { title: 'Rating', key: 'rating', sortable: true, width: '15%' },
  { title: 'Status', key: 'published', sortable: true, width: '17%' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: '13%' },
];

function customerInitials(name) {
  return String(name || 'C')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

const publishedTestimonials = computed(() => testimonials.value.filter((item) => item.published).length);
const averageRating = computed(() => {
  if (!testimonials.value.length) return '0.0';
  const total = testimonials.value.reduce((sum, item) => sum + Number(item.rating || 0), 0);
  return (total / testimonials.value.length).toFixed(1);
});

function emptyForm() {
  return { customerName: '', role: '', quote: '', rating: 5, published: true };
}

async function load() {
  const res = await adminApi.testimonials.list({ page: 1, limit: 100 });
  testimonials.value = res.data || [];
}

function openCreate() {
  editing.value = null;
  form.value = emptyForm();
  showModal.value = true;
}

function openEdit(t) {
  editing.value = t;
  form.value = { customerName: t.customer_name, role: t.role, quote: t.quote, rating: t.rating, published: !!t.published };
  showModal.value = true;
}

async function save() {
  if (editing.value) await adminApi.testimonials.update(editing.value.id, form.value);
  else await adminApi.testimonials.create(form.value);
  showModal.value = false;
  await load();
}

async function togglePublish(t) {
  const nextValue = !t.published;
  t.published = nextValue;
  try {
    await adminApi.testimonials.update(t.id, { published: nextValue });
  } catch (error) {
    t.published = !nextValue;
    throw error;
  }
}

async function remove(t) {
  if (!await confirmAction(`Delete testimonial from "${t.customer_name}"?`, { title: 'Delete this testimonial?' })) return;
  await adminApi.testimonials.remove(t.id);
  testimonials.value = testimonials.value.filter((item) => item.id !== t.id);
}

onMounted(load);
</script>

<style scoped>
.page-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.3rem 1.4rem;
  border-radius: 1.6rem;
  background: linear-gradient(120deg, #fff7ed 0%, #ffedd5 55%, #fed7aa 100%);
  color: #431407;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
}

.page-hero::after {
  content: '';
  position: absolute;
  right: -3rem;
  bottom: -5rem;
  width: 15rem;
  height: 15rem;
  border: 1px solid rgba(251, 191, 36, 0.22);
  border-radius: 50%;
  box-shadow: 0 0 0 2.5rem rgba(251, 191, 36, 0.04), 0 0 0 5rem rgba(251, 191, 36, 0.025);
  pointer-events: none;
}

.hero-copy,
.hero-actions {
  position: relative;
  z-index: 1;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-hero .eyebrow {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #c2410c;
}

.page-hero h1 {
  margin: 0.5rem 0 0;
  font-size: clamp(1.9rem, 2vw, 2.8rem);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.hero-subtitle {
  margin: 0.25rem 0 0;
  color: rgba(124,45,18,0.72);
  font-size: 0.88rem;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.hero-count {
  color: rgba(124,45,18,0.62);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 0.9rem;
  font-size: 0.82rem;
  font-weight: 600;
  box-shadow: 0 10px 22px rgba(249, 115, 22, 0.25);
  transition: transform 180ms ease;
}

.primary-action:hover {
  transform: translateY(-1px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.stats-card {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 1.2rem;
  padding: 1rem 1.1rem;
  box-shadow: 0 12px 22px rgba(15, 23, 42, 0.04);
}

.stats-card::after {
  content: '';
  position: absolute;
  right: -1.6rem;
  bottom: -2.3rem;
  width: 6rem;
  height: 6rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 50%;
}

.stats-card--dark {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
  color: #431407;
}

.stats-card--green { border-top: 3px solid #10b981; }
.stats-card--gold { border-top: 3px solid #f59e0b; }

.stats-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.stats-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stats-pill--light { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.92); }
.stats-pill--success { background: rgba(16,185,129,0.12); color: #047857; }
.stats-pill--warning { background: rgba(245,158,11,0.12); color: #b45309; }

.stats-card span {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.stats-card strong {
  display: block;
  margin-top: 0.5rem;
  font-size: clamp(1.35rem, 2vw, 2rem);
  letter-spacing: -0.05em;
}

.table-shell {
  overflow: hidden;
  border-radius: 1.6rem;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.05);
}

.table-shell table {
  width: 100%;
  border-collapse: collapse;
}

.table-shell thead {
  background: #fff7ed;
  color: #9a3412;
}

.table-shell th,
.table-shell td {
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
}

.table-shell tbody tr:last-child td {
  border-bottom: none;
}

.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem 0.8rem;
  background: white;
}

.table-heading h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
}

.table-kicker {
  margin: 0 0 0.2rem !important;
  color: #c17d13 !important;
  font-size: 0.62rem !important;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.table-hint {
  white-space: nowrap;
}

.table-heading p,
.table-heading > span {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.75rem;
}

.customer-cell {
  display: flex;
  align-items: center;
  min-width: 14rem;
  gap: 0.65rem;
}

.customer-avatar {
  display: grid;
  width: 2.15rem;
  height: 2.15rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 0.7rem;
  background: linear-gradient(135deg, #fef3c7, #fdba74);
  color: #9a3412;
  font-size: 0.7rem;
  font-weight: 800;
}

.customer-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.15rem;
}

.customer-cell strong {
  color: #1e293b;
}

.customer-cell small {
  color: #94a3b8;
  font-size: 0.72rem;
}

.quote-cell {
  display: block;
  max-width: 22rem;
  overflow: hidden;
  color: #64748b;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quote-mark {
  margin-right: 0.2rem;
  color: #f59e0b;
  font-family: Georgia, serif;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 0;
}

.rating-cell {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #b45309;
  font-weight: 700;
  white-space: nowrap;
}

:deep(.rating-cell .v-rating) {
  flex: 0 0 auto;
}

.status-pill {
  border-radius: 999px;
  padding: 0.38rem 0.7rem;
  font-size: 0.72rem;
  font-weight: 700;
}

.status-pill--success {
  background: #dff7ed;
  color: #047857;
}

.status-pill--muted {
  background: #f1f5f9;
  color: #64748b;
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
}

:deep(.table-actions .v-btn) {
  min-width: auto;
  height: 2.15rem;
  padding: 0 0.65rem;
  border-radius: 0.6rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
}

:deep(.table-actions .testimonial-edit) {
  color: #c2410c;
  background: #fff7ed;
  font-weight: 700;
}

:deep(.table-actions .testimonial-delete) {
  color: #dc2626;
}

.empty-table-state {
  padding: 3rem 1rem;
  color: #94a3b8;
  text-align: center;
}

:deep(.admin-data-table .v-data-table__thead th),
:deep(.admin-data-table .v-data-table-header th),
:deep(.admin-data-table .v-data-table__th) {
  background: #f8fafc !important;
  color: #475569 !important;
  border-bottom: 1px solid #e2e8f0 !important;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

:deep(.admin-data-table .v-table__wrapper) {
  overflow-x: hidden;
}

:deep(.admin-data-table table) {
  table-layout: fixed;
  min-width: 0 !important;
}

:deep(.admin-data-table .v-data-table__td) {
  height: 4.35rem !important;
  border-bottom: 1px solid #f1f5f9 !important;
  vertical-align: middle;
}

:deep(.admin-data-table .v-data-table__tr:hover) {
  background: #fffaf3 !important;
}

:deep(.admin-data-table .v-data-table__tbody tr:last-child td) {
  border-bottom: none !important;
}

:deep(.admin-data-table .v-data-table-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 0.65rem 1rem;
}

@media (max-width: 640px) {
  .page-hero {
    flex-direction: column;
    align-items: stretch;
    padding: 1.1rem 1rem;
  }

  .hero-actions {
    justify-content: space-between;
  }

  .hero-count,
  .table-hint {
    white-space: normal;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
