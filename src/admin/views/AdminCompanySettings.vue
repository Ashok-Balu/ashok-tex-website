<template>
  <div class="space-y-6">
    <h1 class="font-display text-2xl font-bold text-ink-900">Company Settings</h1>
    <p v-if="saved" class="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">Company settings saved.</p>

    <form class="space-y-6" @submit.prevent="save">
      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">General</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">Contact Details</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">Address</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">Management Team</h2>
          <button type="button" @click="addManagementMember" class="px-3 py-2 bg-brand-100 text-brand-700 rounded-lg text-xs font-semibold whitespace-nowrap">Add Member</button>
        </div>
        <div v-for="(member, index) in form.managementMembers" :key="`member-${index}`" class="border border-surface-200 rounded-2xl p-4 space-y-3">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <p class="text-sm font-semibold text-ink-900">Member {{ index + 1 }}</p>
            <button type="button" @click="removeManagementMember(index)" class="text-xs font-medium text-red-600">Remove</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div class="flex flex-col sm:flex-row gap-2">
                <input v-model="member.image" class="input-field flex-1 text-base" placeholder="https://example.com/photo.jpg" />
                <input :ref="(el) => setMemberInputRef(el, index)" type="file" accept="image/*" class="hidden" @change="handleMemberFileChange($event, index)" />
                <button type="button" @click="triggerMemberInput(index)" :disabled="uploadingMemberIndex === index" class="px-3 py-2 border border-surface-300 text-ink-700 bg-white rounded-xl text-xs font-semibold hover:border-brand-300 hover:text-brand-700 disabled:opacity-60 whitespace-nowrap">
                  {{ uploadingMemberIndex === index ? 'Uploading...' : 'Upload' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">Main Legacy Image</h2>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Image URL</label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input v-model="form.legacyImage" class="input-field flex-1 text-base" placeholder="https://example.com/legacy-factory.jpg" />
              <input ref="legacyImageInput" type="file" accept="image/*" class="hidden" @change="handleLegacyImageFileChange" />
              <button type="button" @click="triggerLegacyImageInput" :disabled="uploadingLegacyImage" class="px-3 py-2 border border-surface-300 text-ink-700 bg-white rounded-xl text-xs font-semibold hover:border-brand-300 hover:text-brand-700 disabled:opacity-60 whitespace-nowrap">
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

      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">About Gallery</h2>
          <div class="flex gap-2">
            <input ref="bulkGalleryInput" type="file" multiple accept="image/*" class="hidden" @change="handleBulkGalleryUpload" />
            <button type="button" @click="triggerBulkGalleryInput" :disabled="uploadingBulkGallery" class="px-3 py-2 bg-brand-100 text-brand-700 rounded-lg text-xs font-semibold hover:bg-brand-200 disabled:opacity-60 whitespace-nowrap">
              {{ uploadingBulkGallery ? 'Uploading...' : 'Add Photo' }}
            </button>
          </div>
        </div>
        <div v-for="(image, index) in form.aboutGallery" :key="`gallery-${index}`" class="border border-surface-200 rounded-2xl p-4 space-y-3">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <p class="text-sm font-semibold text-ink-900">Photo {{ index + 1 }}</p>
            <button type="button" @click="removeGalleryImage(index)" class="text-xs font-medium text-red-600">Remove</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-ink-700 mb-1.5">Image URL</label>
              <div class="flex flex-col sm:flex-row gap-2">
                <input v-model="image.url" class="input-field flex-1 text-base" placeholder="https://example.com/factory.jpg" />
                <input :ref="(el) => setGalleryInputRef(el, index)" type="file" accept="image/*" class="hidden" @change="handleGalleryFileChange($event, index)" />
                <button type="button" @click="triggerGalleryInput(index)" :disabled="uploadingGalleryIndex === index" class="px-3 py-2 border border-surface-300 text-ink-700 bg-white rounded-xl text-xs font-semibold hover:border-brand-300 hover:text-brand-700 disabled:opacity-60 whitespace-nowrap">
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
      </section>

      <button type="submit" class="w-full sm:w-auto px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm">Save Company Settings</button>
    </form>
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
