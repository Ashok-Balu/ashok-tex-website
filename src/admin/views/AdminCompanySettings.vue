<template>
  <div class="space-y-6 pb-8">
    <header class="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-ink-950 via-ink-900 to-brand-900 px-4 py-5 text-white shadow-card sm:px-6 sm:py-7">
      <div class="absolute inset-0 bg-dot-pattern opacity-20"></div>
      <div class="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10"></div>
      <div class="absolute -bottom-12 left-8 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl"></div>
      <div class="absolute right-6 top-6 h-24 w-24 rounded-full border border-brand-300/35 bg-brand-500/10 backdrop-blur-sm"></div>

      <div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-300">Business profile</p>
          <h1 class="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">Company Settings</h1>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 ring-1 ring-white/10">Live</span>
          <span class="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-100 ring-1 ring-brand-300/30">Updated</span>
        </div>
      </div>

      <p class="relative z-10 mt-3 max-w-2xl text-sm text-white/72">
        Manage your core identity, contact channels, address details, and leadership highlights from one polished workspace.
      </p>

      <div class="relative z-10 mt-5 grid gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
          <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">Brand</p>
          <p class="mt-2 text-base font-semibold text-white line-clamp-1">{{ form.name || 'Add company name' }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
          <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">Contact</p>
          <p class="mt-2 text-base font-semibold text-white line-clamp-1">{{ form.phone || 'Add phone' }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
          <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">Gallery</p>
          <p class="mt-2 text-base font-semibold text-white">{{ Array.isArray(form.aboutGallery) ? form.aboutGallery.length : 0 }} photos</p>
        </div>
      </div>
    </header>

    <p v-if="saved" class="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
      <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
      Company settings saved.
    </p>

    <v-form class="space-y-6" @submit.prevent="save">
      <section class="card p-4 sm:p-6">
        <div class="mb-5 flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-sm font-bold text-brand-700">01</span>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600">General</p>
            <h2 class="mt-1 text-lg font-semibold text-ink-900">Brand overview</h2>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Company Name</label>
            <input v-model="form.name" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Tagline</label>
            <input v-model="form.tagline" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Founder</label>
            <input v-model="form.founder" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Established Year</label>
            <input v-model="form.establishedYear" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Business Type</label>
            <input v-model="form.businessType" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">GSTIN</label>
            <input v-model="form.gstin" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Contact Person</label>
            <input v-model="form.contactPerson" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Market Covered</label>
            <input v-model="form.marketCovered" class="input-field text-base" />
          </div>
        </div>
      </section>

      <section class="card p-4 sm:p-6">
        <div class="mb-5 flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">02</span>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Contact</p>
            <h2 class="mt-1 text-lg font-semibold text-ink-900">Reachability</h2>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Phone (Display)</label>
            <input v-model="form.phone" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Phone (Raw, for tel: links)</label>
            <input v-model="form.phoneRaw" class="input-field text-base" @input="sanitizePhone('phoneRaw')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Secondary Phone</label>
            <input v-model="form.phoneSecondary" class="input-field text-base" @input="sanitizePhone('phoneSecondary')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Secondary Phone (Raw)</label>
            <input v-model="form.phoneSecondaryRaw" class="input-field text-base" @input="sanitizePhone('phoneSecondaryRaw')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
            <input v-model="form.email" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Website</label>
            <input v-model="form.website" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">WhatsApp Number (digits only)</label>
            <input v-model="form.whatsappNumber" class="input-field text-base" @input="sanitizePhone('whatsappNumber')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Google Maps URL</label>
            <input v-model="form.googleMapsUrl" class="input-field text-base" />
          </div>
        </div>
      </section>

      <section class="card p-4 sm:p-6">
        <div class="mb-5 flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-sm font-bold text-amber-700">03</span>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Location</p>
            <h2 class="mt-1 text-lg font-semibold text-ink-900">Office address</h2>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Street</label>
            <input v-model="form.address.street" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">City</label>
            <input v-model="form.address.city" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">State</label>
            <input v-model="form.address.state" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Pincode</label>
            <input v-model="form.address.pincode" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Country</label>
            <input v-model="form.address.country" class="input-field text-base" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Full Address (display)</label>
            <textarea v-model="form.address.full" rows="2" class="input-field text-base resize-none"></textarea>
          </div>
        </div>
      </section>

      <section class="card p-4 sm:p-6">
        <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">04</span>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Leadership</p>
              <h2 class="mt-1 text-lg font-semibold text-ink-900">Management team</h2>
            </div>
          </div>
          <button type="button" @click="addManagementMember" class="inline-flex items-center justify-center rounded-xl bg-brand-100 px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-200">Add member</button>
        </div>

        <div class="space-y-4">
          <div v-for="(member, index) in form.managementMembers" :key="`member-${index}`" class="rounded-2xl border border-surface-200 bg-surface-50 p-4 sm:p-5">
            <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm font-semibold text-ink-900">Member {{ index + 1 }}</p>
              <button type="button" @click="removeManagementMember(index)" class="text-xs font-medium text-red-600 transition hover:text-red-700">Remove</button>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1.5">Name</label>
                <input v-model="member.name" class="input-field text-base" />
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-700 mb-1.5">Role</label>
                <input v-model="member.role" class="input-field text-base" placeholder="M.D / J.M.D / Managing Director" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-ink-700 mb-1.5">Content</label>
                <textarea v-model="member.description" rows="3" class="input-field text-base resize-none"></textarea>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-ink-700 mb-1.5">Image URL</label>
                <div class="flex flex-col gap-2 sm:flex-row">
                  <input v-model="member.image" class="input-field flex-1 text-base" placeholder="https://example.com/photo.jpg" />
                  <input :ref="(el) => setMemberInputRef(el, index)" type="file" accept="image/*" class="hidden" @change="handleMemberFileChange($event, index)" />
                  <button type="button" @click="triggerMemberInput(index)" :disabled="uploadingMemberIndex === index" class="inline-flex items-center justify-center rounded-xl border border-surface-300 bg-white px-3 py-2 text-xs font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-60">
                    {{ uploadingMemberIndex === index ? 'Uploading...' : 'Upload' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="card p-4 sm:p-6">
        <div class="mb-5 flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-sm font-bold text-rose-700">05</span>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">Media</p>
            <h2 class="mt-1 text-lg font-semibold text-ink-900">Legacy image</h2>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Image URL</label>
            <div class="flex flex-col gap-2 sm:flex-row">
              <input v-model="form.legacyImage" class="input-field flex-1 text-base" placeholder="https://example.com/legacy-factory.jpg" />
              <input ref="legacyImageInput" type="file" accept="image/*" class="hidden" @change="handleLegacyImageFileChange" />
              <button type="button" @click="triggerLegacyImageInput" :disabled="uploadingLegacyImage" class="inline-flex items-center justify-center rounded-xl border border-surface-300 bg-white px-3 py-2 text-xs font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-60">
                {{ uploadingLegacyImage ? 'Uploading...' : 'Upload' }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Alt Text / Caption</label>
            <input v-model="form.legacyImageCaption" class="input-field text-base" placeholder="Ashok Tex textile production facility" />
          </div>
        </div>
      </section>

      <section class="card p-4 sm:p-6">
        <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-700">06</span>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600">Gallery</p>
              <h2 class="mt-1 text-lg font-semibold text-ink-900">About photos</h2>
            </div>
          </div>
          <div class="flex gap-2">
            <input ref="bulkGalleryInput" type="file" multiple accept="image/*" class="hidden" @change="handleBulkGalleryUpload" />
            <button type="button" @click="triggerBulkGalleryInput" :disabled="uploadingBulkGallery" class="inline-flex items-center justify-center rounded-xl bg-brand-100 px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-200 disabled:opacity-60">
              {{ uploadingBulkGallery ? 'Uploading...' : 'Add photo' }}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="(image, index) in form.aboutGallery" :key="`gallery-${index}`" class="rounded-2xl border border-surface-200 bg-surface-50 p-4 sm:p-5">
            <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm font-semibold text-ink-900">Photo {{ index + 1 }}</p>
              <button type="button" @click="removeGalleryImage(index)" class="text-xs font-medium text-red-600 transition hover:text-red-700">Remove</button>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-ink-700 mb-1.5">Image URL</label>
                <div class="flex flex-col gap-2 sm:flex-row">
                  <input v-model="image.url" class="input-field flex-1 text-base" placeholder="https://example.com/factory.jpg" />
                  <input :ref="(el) => setGalleryInputRef(el, index)" type="file" accept="image/*" class="hidden" @change="handleGalleryFileChange($event, index)" />
                  <button type="button" @click="triggerGalleryInput(index)" :disabled="uploadingGalleryIndex === index" class="inline-flex items-center justify-center rounded-xl border border-surface-300 bg-white px-3 py-2 text-xs font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-60">
                    {{ uploadingGalleryIndex === index ? 'Uploading...' : 'Upload' }}
                  </button>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-ink-700 mb-1.5">Caption</label>
                <input v-model="image.caption" class="input-field text-base" placeholder="Optional caption" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="flex justify-end pt-2">
        <button type="submit" class="inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 sm:w-auto">Save Company Settings</button>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminApi } from '../../services/api';
import { digitsOnly } from '../../utils/phone';
import { useCompany } from '../../composables/useCompany';

const saved = ref(false);
const form = ref({ address: {}, managementMembers: [], aboutGallery: [], legacyImage: '', legacyImageCaption: '' });
const uploadingMemberIndex = ref(null);
const uploadingGalleryIndex = ref(null);
const uploadingLegacyImage = ref(false);
const uploadingBulkGallery = ref(false);
const memberFileInputs = ref([]);
const galleryFileInputs = ref([]);
const legacyImageInput = ref(null);
const bulkGalleryInput = ref(null);
const { refreshCompany } = useCompany();

function setMemberInputRef(el, index) {
  memberFileInputs.value[index] = el;
}

function setGalleryInputRef(el, index) {
  galleryFileInputs.value[index] = el;
}

function triggerMemberInput(index) {
  memberFileInputs.value[index]?.click();
}

function triggerGalleryInput(index) {
  galleryFileInputs.value[index]?.click();
}

function triggerLegacyImageInput() {
  legacyImageInput.value?.click();
}

function triggerBulkGalleryInput() {
  bulkGalleryInput.value?.click();
}

async function uploadSingleFile(file, onSuccess) {
  if (!file) return;
  const res = await adminApi.upload([file]);
  const uploadedUrl = res?.data?.[0]?.url;
  if (uploadedUrl) onSuccess(uploadedUrl);
}

async function handleMemberFileChange(event, index) {
  const file = event.target.files?.[0];
  if (!file) return;
  uploadingMemberIndex.value = index;
  try {
    await uploadSingleFile(file, (url) => { form.value.managementMembers[index].image = url; });
  } finally {
    uploadingMemberIndex.value = null;
    event.target.value = '';
  }
}

async function handleGalleryFileChange(event, index) {
  const file = event.target.files?.[0];
  if (!file) return;
  uploadingGalleryIndex.value = index;
  try {
    await uploadSingleFile(file, (url) => { form.value.aboutGallery[index].url = url; });
  } finally {
    uploadingGalleryIndex.value = null;
    event.target.value = '';
  }
}

async function handleLegacyImageFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  uploadingLegacyImage.value = true;
  try {
    await uploadSingleFile(file, (url) => { form.value.legacyImage = url; });
  } finally {
    uploadingLegacyImage.value = false;
    event.target.value = '';
  }
}

async function handleBulkGalleryUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  uploadingBulkGallery.value = true;
  try {
    const BATCH_SIZE = 5;
    const batches = [];
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      batches.push(files.slice(i, i + BATCH_SIZE));
    }
    for (const batch of batches) {
      const res = await adminApi.upload(batch);
      const uploadedUrls = res?.data || [];
      for (const uploadedFile of uploadedUrls) {
        form.value.aboutGallery.push({ url: uploadedFile.url, caption: '' });
      }
    }
  } finally {
    uploadingBulkGallery.value = false;
    event.target.value = '';
  }
}

function sanitizePhone(field) {
  const value = form.value[field] || '';
  form.value[field] = digitsOnly(value);
}

function ensureCollections() {
  if (!Array.isArray(form.value.managementMembers)) form.value.managementMembers = [];
  if (!Array.isArray(form.value.aboutGallery)) form.value.aboutGallery = [];
  if (!form.value.legacyImage && Array.isArray(form.value.aboutGallery) && form.value.aboutGallery.length) {
    form.value.legacyImage = form.value.aboutGallery[0].url || '';
  }
  if (!form.value.legacyImageCaption && Array.isArray(form.value.aboutGallery) && form.value.aboutGallery.length) {
    form.value.legacyImageCaption = form.value.aboutGallery[0].caption || 'Ashok Tex textile production facility';
  }

  if (!form.value.managementMembers.length) {
    form.value.managementMembers = [
      {
        name: 'M. Balusamy',
        role: 'Founder & Leadership',
        description: 'Known person in town for his weaving techniques, reliability, designing work and quality management. He has born and bought up from a weaving factory in his childhood days.',
        image: '',
      },
      {
        name: 'B. Arvinth',
        role: 'Business & Finance',
        description: 'Once after his studies he joined the business. From then till now he has full experience in business and He is looking after merchandising and finance and accounts.',
        image: '',
      },
    ];
  }
}

function addManagementMember() {
  form.value.managementMembers.push({ name: '', role: '', description: '', image: '' });
}

function removeManagementMember(index) {
  form.value.managementMembers.splice(index, 1);
}

function addGalleryImage() {
  form.value.aboutGallery.push({ url: '', caption: '' });
}

function removeGalleryImage(index) {
  form.value.aboutGallery.splice(index, 1);
}

async function load() {
  const res = await adminApi.settings.company();
  form.value = { address: {}, managementMembers: [], aboutGallery: [], legacyImage: '', legacyImageCaption: '', ...res.data };
  ensureCollections();
  if (!form.value.address) form.value.address = {};
  ['phone', 'phoneRaw', 'phoneSecondary', 'phoneSecondaryRaw', 'whatsappNumber'].forEach((field) => sanitizePhone(field));
}

async function save() {
  ensureCollections();
  await adminApi.settings.updateCompany(form.value);
  await refreshCompany();
  saved.value = true;
  setTimeout(() => { saved.value = false; }, 3000);
}

onMounted(load);
</script>
