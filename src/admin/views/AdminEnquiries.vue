<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-2">Inbox / customer intent</p>
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-ink-950">Enquiries</h1>
        <p class="text-xs sm:text-sm text-ink-500 mt-1">Turn quote requests and customer messages into your next conversation.</p>
      </div>
      <div class="flex items-center gap-2 text-xs font-medium text-ink-500 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        Live from MongoDB
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <div class="enquiry-stat-card bg-brand-50 text-ink-900 border-brand-100 shadow-card">
        <div class="relative z-10 flex items-center justify-between"><div><p class="text-xs text-brand-700/70">Total enquiries</p><p class="text-xl sm:text-2xl font-bold mt-2">{{ enquiries.length }}</p></div><Inbox class="w-4 sm:w-5 h-4 sm:h-5 text-brand-500 shrink-0" /></div>
        <div class="absolute -right-4 -bottom-6 w-20 h-20 rounded-full border border-white/10"></div>
      </div>
      <div class="enquiry-stat-card bg-white border-surface-200 shadow-sm"><div class="flex items-center justify-between"><div><p class="text-xs text-ink-500">Needs attention</p><p class="text-xl sm:text-2xl font-bold text-ink-950 mt-2">{{ newEnquiries }}</p></div><Clock3 class="w-4 sm:w-5 h-4 sm:h-5 text-amber-500 shrink-0" /></div></div>
      <div class="enquiry-stat-card bg-white border-surface-200 shadow-sm"><div class="flex items-center justify-between"><div><p class="text-xs text-ink-500">Closed enquiries</p><p class="text-xl sm:text-2xl font-bold text-ink-950 mt-2">{{ closedEnquiries }}</p></div><CheckCircle2 class="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500 shrink-0" /></div></div>
      <div class="enquiry-stat-card bg-white border-surface-200 shadow-sm"><div class="flex items-center justify-between"><div><p class="text-xs text-ink-500">Contact messages</p><p class="text-xl sm:text-2xl font-bold text-ink-950 mt-2">{{ messages.length }}</p></div><MessageSquare class="w-4 sm:w-5 h-4 sm:h-5 text-brand-500 shrink-0" /></div></div>
    </div>

    <div class="enquiry-tabs" role="tablist" aria-label="Enquiry views">
      <button
        :class="['enquiry-tab', { 'enquiry-tab--active': tab === 'enquiries' }]"
        role="tab"
        :aria-selected="tab === 'enquiries'"
        @click="tab = 'enquiries'"
      >Quote Enquiries <span class="tab-count">{{ enquiries.length }}</span></button>
      <button
        :class="['enquiry-tab', { 'enquiry-tab--active': tab === 'messages' }]"
        role="tab"
        :aria-selected="tab === 'messages'"
        @click="tab = 'messages'"
      >Contact Messages <span class="tab-count">{{ messages.length }}</span></button>
    </div>

    <!-- Quote Enquiries -->
    <div v-if="tab === 'enquiries'">
      <div class="flex flex-col gap-3 mb-4">
        <div class="relative w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input v-model="searchQuery" type="search" placeholder="Search enquiries" class="input-field !pl-9 !py-2.5 bg-white text-base w-full" />
        </div>
        <div class="flex flex-wrap gap-2">
        <button
          v-for="s in ['', 'New', 'Contacted', 'Quoted', 'Follow-up', 'Closed']" :key="s"
          :class="['px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap', statusFilter === s ? 'bg-brand-500 text-white shadow-sm' : 'bg-white border border-surface-200 text-ink-600 hover:border-ink-300']"
          @click="statusFilter = s; loadEnquiries()"
        >{{ s || 'All' }}</button>
        </div>
      </div>

      <div class="enquiry-table-shell">
        <v-data-table
          :headers="enquiryHeaders"
          :items="filteredEnquiries"
          item-value="id"
          :items-per-page="10"
          :items-per-page-options="[10, 25, 50]"
          class="admin-data-table"
          density="comfortable"
          hover
          items-per-page-text="Enquiries per page"
        >
          <template #top><div class="table-heading"><div><h2>Quote requests</h2><p>{{ filteredEnquiries.length }} enquiries shown</p></div><span>Update status as conversations progress</span></div></template>
          <template v-slot:[`item.created_at`]="{ item }"><div class="date-cell"><strong>{{ formatDate(item.created_at) }}</strong><small>{{ formatTime(item.created_at) }}</small></div></template>
          <template v-slot:[`item.name`]="{ item }"><div class="person-cell"><strong>{{ item.name }}</strong><small>{{ item.company || 'Direct enquiry' }}</small></div></template>
          <template v-slot:[`item.product`]="{ item }"><div class="product-cell"><strong>{{ item.product || 'General enquiry' }}</strong><small>{{ item.category || '—' }}</small></div></template>
          <template v-slot:[`item.contact`]="{ item }"><div class="contact-cell"><a :href="`mailto:${item.email}`">{{ item.email }}</a><a :href="`tel:${item.phone}`">{{ item.phone }}</a></div></template>
          <template v-slot:[`item.requirements`]="{ item }"><span class="requirements-cell" :title="item.requirements">{{ item.requirements || '—' }}</span></template>
          <template v-slot:[`item.status`]="{ item }"><select :value="item.status" :class="['status-select', statusColor(item.status)]" @change="updateStatus(item, $event.target.value)"><option v-for="s in ['New', 'Contacted', 'Quoted', 'Follow-up', 'Closed']" :key="s" :value="s">{{ s }}</option></select></template>
            <template v-slot:[`item.actions`]="{ item }"><button class="delete-action" title="Delete enquiry" aria-label="Delete enquiry" @click="removeEnquiry(item)">Delete</button></template>
          <template #no-data><div class="empty-table-state"><Inbox class="w-8 h-8" /><strong>No matching enquiries</strong><span>New quote requests will appear here.</span></div></template>
        </v-data-table>
      </div>
    </div>

    <!-- Contact Messages -->
    <div v-if="tab === 'messages'">
      <div class="message-toolbar">
        <div class="message-status-tabs" role="group" aria-label="Filter contact messages by status">
          <button
            v-for="status in messageStatuses"
            :key="status"
            :class="['message-status-tab', { 'message-status-tab--active': messageStatusFilter === status }]"
            @click="messageStatusFilter = status"
          >{{ status || 'All' }}</button>
        </div>
        <div class="relative w-full sm:max-w-xs ml-auto">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input v-model="searchQuery" type="search" placeholder="Search messages" class="input-field !pl-9 !py-2.5 bg-white text-base w-full" />
        </div>
      </div>
      <div class="enquiry-table-shell">
        <v-data-table
          :headers="messageHeaders"
          :items="filteredMessages"
          item-value="id"
          :items-per-page="10"
          :items-per-page-options="[10, 25, 50]"
          class="admin-data-table"
          density="comfortable"
          hover
          items-per-page-text="Messages per page"
        >
          <template #top><div class="table-heading"><div><h2>Contact messages</h2><p>{{ filteredMessages.length }} messages shown</p></div><span>Keep customer conversations moving</span></div></template>
          <template v-slot:[`item.created_at`]="{ item }"><div class="date-cell"><strong>{{ formatDate(item.created_at) }}</strong><small>{{ formatTime(item.created_at) }}</small></div></template>
          <template v-slot:[`item.name`]="{ item }"><strong class="message-name">{{ item.name }}</strong></template>
          <template v-slot:[`item.contact`]="{ item }"><div class="contact-cell"><a :href="`mailto:${item.email}`">{{ item.email }}</a><a :href="`tel:${item.phone}`">{{ item.phone }}</a></div></template>
          <template v-slot:[`item.message`]="{ item }"><span class="message-cell" :title="item.message">{{ item.message }}</span></template>
          <template v-slot:[`item.status`]="{ item }"><select :value="item.status" class="status-select status-select--message" @change="updateMessageStatus(item, $event.target.value)"><option v-for="s in ['New', 'Read', 'Replied']" :key="s" :value="s">{{ s }}</option></select></template>
              <template v-slot:[`item.actions`]="{ item }"><button class="delete-action" title="Delete message" aria-label="Delete message" @click="removeMessage(item)">Delete</button></template>
          <template #no-data><div class="empty-table-state"><MessageSquare class="w-8 h-8" /><strong>No matching messages</strong><span>Customer contact messages will appear here.</span></div></template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { VDataTable } from 'vuetify/components';
import { CheckCircle2, Clock3, Inbox, Mail, MessageSquare, Phone, Search } from 'lucide-vue-next';
import { adminApi } from '../../services/api';
import { useAdminConfirm } from '../../composables/useAdminConfirm';

const { confirmAction } = useAdminConfirm();

const tab = ref('enquiries');
const enquiries = ref([]);
const messages = ref([]);
const statusFilter = ref('');
const messageStatusFilter = ref('');
const searchQuery = ref('');
const messageStatuses = ['', 'New', 'Read', 'Replied'];

const enquiryHeaders = [
  { title: 'Date', key: 'created_at', sortable: true, width: '11%' },
  { title: 'Customer', key: 'name', sortable: true, width: '15%' },
  { title: 'Product', key: 'product', sortable: true, width: '17%' },
  { title: 'Contact', key: 'contact', sortable: false, width: '19%' },
  { title: 'Requirements', key: 'requirements', sortable: false, width: '20%' },
  { title: 'Status', key: 'status', sortable: true, width: '10%' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: '8%' },
];

const messageHeaders = [
  { title: 'Date', key: 'created_at', sortable: true, width: '13%' },
  { title: 'Customer', key: 'name', sortable: true, width: '17%' },
  { title: 'Contact', key: 'contact', sortable: false, width: '23%' },
  { title: 'Message', key: 'message', sortable: false, width: '27%' },
  { title: 'Status', key: 'status', sortable: true, width: '10%' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: '10%' },
];

const newEnquiries = computed(() => enquiries.value.filter((item) => item.status === 'New').length);
const closedEnquiries = computed(() => enquiries.value.filter((item) => item.status === 'Closed').length);
const filteredEnquiries = computed(() => filterRows(enquiries.value, ['name', 'company', 'email', 'phone', 'product', 'category', 'requirements']));
const filteredMessages = computed(() => filterRows(
  messages.value.filter((row) => !messageStatusFilter.value || row.status === messageStatusFilter.value),
  ['name', 'email', 'phone', 'message'],
));

function filterRows(rows, fields) {
  const needle = searchQuery.value.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) => fields.some((field) => String(row[field] || '').toLowerCase().includes(needle)));
}

async function loadEnquiries() {
  const res = await adminApi.enquiries.list({ status: statusFilter.value, page: 1, limit: 100 });
  enquiries.value = res.data || [];
}

async function loadMessages() {
  const res = await adminApi.contacts.list({ page: 1, limit: 100 });
  messages.value = res.data || [];
}

async function updateStatus(e, status) {
  const previous = e.status;
  e.status = status;
  try {
    await adminApi.enquiries.updateStatus(e.id, status);
  } catch (error) {
    e.status = previous;
    throw error;
  }
}

async function removeEnquiry(e) {
  if (!await confirmAction(`Delete enquiry from "${e.name}"?`, { title: 'Delete this enquiry?' })) return;
  await adminApi.enquiries.remove(e.id);
  enquiries.value = enquiries.value.filter((item) => item.id !== e.id);
}

async function updateMessageStatus(m, status) {
  const previous = m.status;
  m.status = status;
  try {
    await adminApi.contacts.updateStatus(m.id, status);
  } catch (error) {
    m.status = previous;
    throw error;
  }
}

async function removeMessage(m) {
  if (!await confirmAction(`Delete message from "${m.name}"?`, { title: 'Delete this message?' })) return;
  await adminApi.contacts.remove(m.id);
  messages.value = messages.value.filter((item) => item.id !== m.id);
}

function statusColor(status) {
  return {
    New: '!bg-blue-50 !text-blue-700',
    Contacted: '!bg-amber-50 !text-amber-700',
    Quoted: '!bg-purple-50 !text-purple-700',
    'Follow-up': '!bg-orange-50 !text-orange-700',
    Closed: '!bg-green-50 !text-green-700',
  }[status] || '';
}

function formatDate(str) {
  try { return new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return str; }
}

function formatTime(str) {
  try { return new Date(str).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; }
}

onMounted(() => { loadEnquiries(); loadMessages(); });
</script>

<style scoped>
.enquiry-tabs {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.9rem;
  background: #f8fafc;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.enquiry-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.65rem;
  padding: 0.65rem 0.9rem;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  transition: color 160ms ease, background 160ms ease, box-shadow 160ms ease;
}

.enquiry-tab:hover {
  color: #334155;
  background: white;
}

.enquiry-tab--active {
  border-color: #fed7aa;
  background: white;
  color: #c2410c;
  box-shadow: 0 4px 10px rgba(234, 88, 12, 0.1);
}

.tab-count {
  display: inline-grid;
  min-width: 1.35rem;
  height: 1.35rem;
  place-items: center;
  border-radius: 999px;
  background: #e2e8f0;
  color: #64748b;
  font-size: 0.68rem;
}

.enquiry-tab--active .tab-count {
  background: #ffedd5;
  color: #c2410c;
}

.message-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.message-status-tabs {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  overflow-x: auto;
  padding: 0.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.8rem;
  background: #f8fafc;
}

.message-status-tab {
  border-radius: 0.55rem;
  padding: 0.48rem 0.72rem;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
  transition: color 160ms ease, background 160ms ease, box-shadow 160ms ease;
}

.message-status-tab:hover {
  background: white;
  color: #334155;
}

.message-status-tab--active {
  background: white;
  color: #c2410c;
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.08);
}

.enquiry-table-shell {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
}

.enquiry-stat-card {
  position: relative;
  overflow: hidden;
  border-width: 1px;
  border-style: solid;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
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

.table-heading p,
.table-heading > span {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.75rem;
}

.date-cell,
.person-cell,
.product-cell,
.contact-cell {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.date-cell strong,
.person-cell strong,
.product-cell strong,
.message-name {
  color: #1e293b;
  font-size: 0.8rem;
}

.date-cell small,
.person-cell small,
.product-cell small {
  color: #94a3b8;
  font-size: 0.7rem;
}

.contact-cell {
  min-width: 12rem;
}

.contact-cell a {
  overflow: hidden;
  color: #c2410c;
  font-size: 0.76rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact-cell a:last-child {
  color: #64748b;
}

.requirements-cell,
.message-cell {
  display: block;
  max-width: 20rem;
  overflow-wrap: anywhere;
  color: #64748b;
  font-size: 0.78rem;
  line-height: 1.45;
}

.requirements-cell {
  min-width: 12rem;
}

.status-select {
  appearance: none;
  min-width: 6.2rem;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.38rem 1.8rem 0.38rem 0.7rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23647569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 0.55rem center;
  background-repeat: no-repeat;
  background-size: 0.8rem;
  font-size: 0.72rem;
  font-weight: 700;
  outline: none;
}

.status-select--message {
  background: #eff6ff;
  color: #1d4ed8;
}

.delete-action {
  display: inline-flex;
  align-items: center;
  border-radius: 0.55rem;
  padding: 0.42rem 0.6rem;
  color: #dc2626;
  font-size: 0.74rem;
  font-weight: 700;
  transition: background 160ms ease;
}

.delete-action:hover {
  background: #fef2f2;
}

.empty-table-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 3rem 1rem;
  color: #94a3b8;
  text-align: center;
}

.empty-table-state strong {
  color: #475569;
}

:deep(.admin-data-table .v-data-table__thead th),
:deep(.admin-data-table .v-data-table-header th),
:deep(.admin-data-table .v-data-table__th) {
  background: #f8fafc !important;
  color: #475569 !important;
  border-bottom: 1px solid #e2e8f0 !important;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

:deep(.admin-data-table .v-data-table__td) {
  min-width: 0;
  padding: 1rem 0.85rem !important;
  border-bottom: 1px solid #f1f5f9 !important;
  vertical-align: middle;
}

:deep(.admin-data-table .v-data-table__wrapper) {
  overflow-x: auto;
  scrollbar-color: #cbd5e1 transparent;
  scrollbar-width: thin;
}

:deep(.admin-data-table table) {
  min-width: 1120px;
  table-layout: fixed;
}

:deep(.admin-data-table .v-data-table__tr:hover) {
  background: #fffaf3 !important;
}

:deep(.admin-data-table .v-data-table-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 0.65rem 1rem;
}

@media (max-width: 900px) {
  .table-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .message-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .message-status-tabs {
    width: 100%;
  }
}
</style>

