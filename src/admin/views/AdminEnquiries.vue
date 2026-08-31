<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-2">Inbox / customer intent</p>
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-ink-950">Enquiries</h1>
        <p class="text-xs sm:text-sm text-ink-500 mt-1">Turn quote requests and customer messages into your next conversation.</p>
      </div>
      <div class="flex items-center gap-2 text-xs font-medium text-ink-500 whitespace-nowrap">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        Live from Supabase
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="bg-ink-950 text-white rounded-2xl p-3 sm:p-4 relative overflow-hidden">
        <div class="relative z-10 flex items-start justify-between"><div><p class="text-xs text-white/55">Total enquiries</p><p class="text-xl sm:text-2xl font-bold mt-2">{{ enquiries.length }}</p></div><Inbox class="w-4 sm:w-5 h-4 sm:h-5 text-brand-400 shrink-0" /></div>
        <div class="absolute -right-4 -bottom-6 w-20 h-20 rounded-full border border-white/10"></div>
      </div>
      <div class="bg-white rounded-2xl border border-surface-200 p-3 sm:p-4"><div class="flex items-start justify-between"><div><p class="text-xs text-ink-500">Needs attention</p><p class="text-xl sm:text-2xl font-bold text-ink-950 mt-2">{{ newEnquiries }}</p></div><Clock3 class="w-4 sm:w-5 h-4 sm:h-5 text-amber-500 shrink-0" /></div></div>
      <div class="bg-white rounded-2xl border border-surface-200 p-3 sm:p-4"><div class="flex items-start justify-between"><div><p class="text-xs text-ink-500">Closed enquiries</p><p class="text-xl sm:text-2xl font-bold text-ink-950 mt-2">{{ closedEnquiries }}</p></div><CheckCircle2 class="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500 shrink-0" /></div></div>
      <div class="bg-white rounded-2xl border border-surface-200 p-3 sm:p-4"><div class="flex items-start justify-between"><div><p class="text-xs text-ink-500">Contact messages</p><p class="text-xl sm:text-2xl font-bold text-ink-950 mt-2">{{ messages.length }}</p></div><MessageSquare class="w-4 sm:w-5 h-4 sm:h-5 text-brand-500 shrink-0" /></div></div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-surface-200 overflow-x-auto">
      <button
        :class="['px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap', tab === 'enquiries' ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink-500 hover:text-ink-700']"
        @click="tab = 'enquiries'"
      >Quote Enquiries <span class="ml-1 text-xs text-ink-400 hidden sm:inline">({{ enquiries.length }})</span></button>
      <button
        :class="['px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap', tab === 'messages' ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink-500 hover:text-ink-700']"
        @click="tab = 'messages'"
      >Contact Messages <span class="ml-1 text-xs text-ink-400 hidden sm:inline">({{ messages.length }})</span></button>
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
          :class="['px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap', statusFilter === s ? 'bg-ink-900 text-white shadow-sm' : 'bg-white border border-surface-200 text-ink-600 hover:border-ink-300']"
          @click="statusFilter = s; loadEnquiries()"
        >{{ s || 'All' }}</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden overflow-x-auto">
        <table class="w-full text-xs sm:text-sm">
          <thead class="bg-ink-950 text-white/70 text-left">
            <tr>
              <th class="px-3 sm:px-4 py-3 font-medium whitespace-nowrap">Date</th>
              <th class="px-3 sm:px-4 py-3 font-medium">Name</th>
              <th class="px-3 sm:px-4 py-3 font-medium hidden sm:table-cell">Product</th>
              <th class="px-3 sm:px-4 py-3 font-medium">Contact</th>
              <th class="px-3 sm:px-4 py-3 font-medium hidden lg:table-cell">Req</th>
              <th class="px-3 sm:px-4 py-3 font-medium">Status</th>
              <th class="px-3 sm:px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100">
            <tr v-for="e in filteredEnquiries" :key="e.id" class="align-top hover:bg-brand-50/30 transition-colors">
              <td class="px-3 sm:px-4 py-3 text-ink-500 whitespace-nowrap"><span class="text-xs font-semibold text-ink-700">{{ formatDate(e.created_at) }}</span><span class="block text-[10px] text-ink-400 mt-1 hidden sm:block">{{ formatTime(e.created_at) }}</span></td>
              <td class="px-3 sm:px-4 py-3 text-ink-800 font-medium max-w-[8rem] sm:max-w-[10rem]">
                <div class="truncate text-ink-950 text-xs sm:text-sm">{{ e.name }}</div>
                <span v-if="e.company" class="text-[10px] text-ink-400 block truncate">{{ e.company }}</span>
              </td>
              <td class="px-3 sm:px-4 py-3 text-ink-600 hidden sm:table-cell max-w-[10rem]">
                <div class="truncate text-xs sm:text-sm">{{ e.product || '—' }}</div>
                <span class="text-xs text-ink-400 block truncate">{{ e.category }}</span>
              </td>
              <td class="px-3 sm:px-4 py-3 text-ink-500 max-w-[9rem] sm:max-w-[11rem]">
                <a :href="`mailto:${e.email}`" class="flex items-center gap-1 truncate text-brand-600 hover:underline text-xs sm:text-sm"><Mail class="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />{{ e.email }}</a>
                <a :href="`tel:${e.phone}`" class="flex items-center gap-1 truncate hover:underline mt-1 text-xs sm:text-sm"><Phone class="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />{{ e.phone }}</a>
              </td>
              <td class="px-3 sm:px-4 py-3 text-ink-500 hidden lg:table-cell max-w-xs">
                <p class="line-clamp-2 text-xs sm:text-sm" :title="e.requirements">{{ e.requirements || '—' }}</p>
              </td>
              <td class="px-3 sm:px-4 py-3">
                <select :value="e.status" :class="['input-field !py-1 !px-2 text-xs font-semibold rounded-full', statusColor(e.status)]" @change="updateStatus(e, $event.target.value)">
                  <option v-for="s in ['New', 'Contacted', 'Quoted', 'Follow-up', 'Closed']" :key="s" :value="s">{{ s }}</option>
                </select>
              </td>
              <td class="px-3 sm:px-4 py-3 text-right whitespace-nowrap">
                <button class="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-semibold" title="Delete enquiry" aria-label="Delete enquiry" @click="removeEnquiry(e)"><Trash2 class="w-3 h-3" />Delete</button>
              </td>
            </tr>
            <tr v-if="filteredEnquiries.length === 0"><td colspan="7" class="px-4 py-14 text-center"><Inbox class="w-8 h-8 mx-auto text-ink-300" /><p class="text-ink-500 font-medium mt-3">No matching enquiries</p><p class="text-xs text-ink-400 mt-1">New quote requests will appear here.</p></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Contact Messages -->
    <div v-if="tab === 'messages'">
      <div class="mb-4">
        <div class="relative w-full sm:max-w-xs ml-auto">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input v-model="searchQuery" type="search" placeholder="Search messages" class="input-field !pl-9 !py-2.5 bg-white text-base w-full" />
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden overflow-x-auto">
        <table class="w-full text-xs sm:text-sm">
          <thead class="bg-ink-950 text-white/70 text-left">
            <tr>
              <th class="px-3 sm:px-4 py-3 font-medium whitespace-nowrap">Date</th>
              <th class="px-3 sm:px-4 py-3 font-medium">Name</th>
              <th class="px-3 sm:px-4 py-3 font-medium">Contact</th>
              <th class="px-3 sm:px-4 py-3 font-medium hidden sm:table-cell">Message</th>
              <th class="px-3 sm:px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100">
            <tr v-for="m in filteredMessages" :key="m.id" class="align-top hover:bg-brand-50/30 transition-colors">
              <td class="px-3 sm:px-4 py-3 text-ink-500 whitespace-nowrap text-xs sm:text-sm">{{ formatDate(m.created_at) }}</td>
              <td class="px-3 sm:px-4 py-3 text-ink-800 font-medium max-w-[8rem] sm:max-w-[10rem] truncate text-xs sm:text-sm">{{ m.name }}</td>
              <td class="px-3 sm:px-4 py-3 text-ink-500 max-w-[9rem] sm:max-w-[11rem]">
                <a :href="`mailto:${m.email}`" class="flex items-center gap-1 truncate text-brand-600 hover:underline text-xs sm:text-sm"><Mail class="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />{{ m.email }}</a>
                <a :href="`tel:${m.phone}`" class="flex items-center gap-1.5 truncate hover:underline mt-1"><Phone class="w-3.5 h-3.5 shrink-0" />{{ m.phone }}</a>
              </td>
              <td class="px-4 py-3 text-ink-500 max-w-sm">
                <p class="line-clamp-3" :title="m.message">{{ m.message }}</p>
              </td>
              <td class="px-4 py-3">
                <select :value="m.status" class="input-field !py-1.5 !px-2.5 text-xs rounded-full" @change="updateMessageStatus(m, $event.target.value)">
                  <option v-for="s in ['New', 'Read', 'Replied']" :key="s" :value="s">{{ s }}</option>
                </select>
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <button class="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-semibold" title="Delete message" aria-label="Delete message" @click="removeMessage(m)"><Trash2 class="w-3.5 h-3.5" />Delete</button>
              </td>
            </tr>
            <tr v-if="filteredMessages.length === 0"><td colspan="6" class="px-4 py-14 text-center"><MessageSquare class="w-8 h-8 mx-auto text-ink-300" /><p class="text-ink-500 font-medium mt-3">No matching messages</p><p class="text-xs text-ink-400 mt-1">Customer contact messages will appear here.</p></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { CheckCircle2, Clock3, Inbox, Mail, MessageSquare, Phone, Search, Trash2 } from 'lucide-vue-next';
import { adminApi } from '../../services/api';

const tab = ref('enquiries');
const enquiries = ref([]);
const messages = ref([]);
const statusFilter = ref('');
const searchQuery = ref('');

const newEnquiries = computed(() => enquiries.value.filter((item) => item.status === 'New').length);
const closedEnquiries = computed(() => enquiries.value.filter((item) => item.status === 'Closed').length);
const filteredEnquiries = computed(() => filterRows(enquiries.value, ['name', 'company', 'email', 'phone', 'product', 'category', 'requirements']));
const filteredMessages = computed(() => filterRows(messages.value, ['name', 'email', 'phone', 'message']));

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
  if (!confirm(`Delete enquiry from "${e.name}"?`)) return;
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
  if (!confirm(`Delete message from "${m.name}"?`)) return;
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

