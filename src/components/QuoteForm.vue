<template>
  <div class="quote-form bg-white rounded-3xl shadow-section border border-surface-200 overflow-hidden">

    <!-- Header -->
    <div class="bg-gradient-to-r from-ink-900 to-ink-800 px-8 py-8">
      <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-2">B2B Inquiry & Bulk Sourcing</p>
      <h2 class="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Request a Quote</h2>
      <p class="text-white/60 text-sm">Direct mill rates from Karur. Fill in your project details for pricing and availability.</p>
    </div>

    <div class="p-5 sm:p-8">
      <!-- Success -->
      <div v-if="status === 'success'" class="p-6 bg-green-50 border border-green-200 rounded-2xl mb-6 animate-fade-in" role="alert">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <h3 class="font-semibold text-green-900 mb-1">Enquiry Received!</h3>
            <p class="text-sm text-green-700">Thank you. Our team will contact you shortly. You can also reach us at <a href="tel:+917904154775" class="underline font-semibold">+91 7904154775</a>.</p>
            <button type="button" class="mt-3 text-xs font-semibold text-green-800 underline hover:text-green-600" @click="resetForm">Submit another inquiry →</button>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="status === 'error'" class="p-4 bg-red-50 border border-red-200 rounded-2xl mb-6" role="alert">
        <p class="text-sm text-red-700 font-medium">{{ errorMessage || 'Something went wrong. Please try again or contact us directly.' }}</p>
      </div>

      <form v-if="status !== 'success'" @submit.prevent="handleSubmit" novalidate class="space-y-5">
        <!-- Honeypot -->
        <div class="hidden" aria-hidden="true">
          <input v-model="form.honeypot" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label for="fullName" class="block text-sm font-medium text-ink-700 mb-1.5">Full Name <span class="text-red-500">*</span></label>
            <input id="fullName" v-model="form.name" type="text" required placeholder="e.g. Rajesh Kumar" :class="['input-field', errors.name ? 'border-red-400 focus:ring-red-400' : '']" @blur="validateField('name')" />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>
          <div>
            <label for="companyName" class="block text-sm font-medium text-ink-700 mb-1.5">Company / Brand <span class="text-ink-400 font-normal">(optional)</span></label>
            <input id="companyName" v-model="form.company" type="text" placeholder="e.g. Apex Apparels Ltd" class="input-field" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label for="email" class="block text-sm font-medium text-ink-700 mb-1.5">Email Address <span class="text-red-500">*</span></label>
            <input id="email" v-model="form.email" type="email" required placeholder="you@company.com" :class="['input-field', errors.email ? 'border-red-400 focus:ring-red-400' : '']" @blur="validateField('email')" />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-ink-700 mb-1.5">Phone / WhatsApp <span class="text-red-500">*</span></label>
            <input id="phone" v-model="form.phone" type="tel" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" required placeholder="10-digit phone number" :class="['input-field', errors.phone ? 'border-red-400 focus:ring-red-400' : '']" @input="form.phone = digitsOnly(form.phone)" @blur="validateField('phone')" />
            <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label for="fabricCategory" class="block text-sm font-medium text-ink-700 mb-1.5">Fabric Category <span class="text-red-500">*</span></label>
            <div class="quote-dropdown" @click.stop>
              <button type="button" class="quote-dropdown-trigger" :class="errors.category ? 'is-invalid' : ''" :aria-expanded="activeDropdown === 'category'" aria-haspopup="listbox" @click="toggleDropdown('category')">
                <span :class="form.category ? 'text-ink-900' : 'text-ink-400'">{{ selectedCategoryName || 'Select a category' }}</span><ChevronDown :class="['w-4 h-4 text-ink-400 transition-transform', activeDropdown === 'category' ? 'rotate-180' : '']" />
              </button>
              <div v-if="activeDropdown === 'category'" class="quote-dropdown-menu" role="listbox">
                <button v-for="cat in categories" :key="cat.slug" type="button" role="option" :aria-selected="form.category === cat.slug" :class="['quote-dropdown-option', form.category === cat.slug ? 'is-selected' : '']" @click="chooseDropdown('category', cat.slug)">{{ cat.name }}</button>
                <p v-if="!categories.length" class="px-4 py-3 text-sm text-ink-400">No categories available</p>
              </div>
            </div>
            <p v-if="errors.category" class="text-red-500 text-xs mt-1">{{ errors.category }}</p>
          </div>
          <div>
            <label for="productSelect" class="block text-sm font-medium text-ink-700 mb-1.5">Product <span class="text-ink-400 font-normal">(optional)</span></label>
            <div class="quote-dropdown" @click.stop>
              <button type="button" class="quote-dropdown-trigger" :aria-expanded="activeDropdown === 'product'" aria-haspopup="listbox" @click="toggleDropdown('product')"><span :class="form.product ? 'text-ink-900' : 'text-ink-700'">{{ form.product || 'General / Any product' }}</span><ChevronDown :class="['w-4 h-4 text-ink-400 transition-transform', activeDropdown === 'product' ? 'rotate-180' : '']" /></button>
              <div v-if="activeDropdown === 'product'" class="quote-dropdown-menu" role="listbox">
                <button type="button" role="option" :aria-selected="!form.product" :class="['quote-dropdown-option', !form.product ? 'is-selected' : '']" @click="chooseDropdown('product', '')">General / Any product</button>
                <button v-for="product in productOptions" :key="product.id" type="button" role="option" :aria-selected="form.product === product.name" :class="['quote-dropdown-option', form.product === product.name ? 'is-selected' : '']" @click="chooseDropdown('product', product.name)">{{ product.name }}</button>
                <p v-if="!productOptions.length" class="px-4 py-3 text-sm text-ink-400">Choose a category first</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label for="quantity" class="block text-sm font-medium text-ink-700 mb-1.5">Estimated Quantity <span class="text-ink-400 font-normal">(MOQ ~2,500m)</span></label>
            <input id="quantity" v-model="form.quantity" type="number" min="1" placeholder="e.g. 2500" class="input-field" />
          </div>
          <div>
            <label for="unit" class="block text-sm font-medium text-ink-700 mb-1.5">Unit</label>
            <div class="quote-dropdown" @click.stop>
              <button type="button" class="quote-dropdown-trigger" :aria-expanded="activeDropdown === 'unit'" aria-haspopup="listbox" @click="toggleDropdown('unit')"><span class="text-ink-900">{{ form.unit }}</span><ChevronDown :class="['w-4 h-4 text-ink-400 transition-transform', activeDropdown === 'unit' ? 'rotate-180' : '']" /></button>
              <div v-if="activeDropdown === 'unit'" class="quote-dropdown-menu" role="listbox">
                <button v-for="unit in ['Meter', 'Kg', 'Pieces']" :key="unit" type="button" role="option" :aria-selected="form.unit === unit" :class="['quote-dropdown-option', form.unit === unit ? 'is-selected' : '']" @click="chooseDropdown('unit', unit)">{{ unit }}</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label for="purpose" class="block text-sm font-medium text-ink-700 mb-1.5">Purpose of Requirement <span class="text-red-500">*</span></label>
          <div class="quote-dropdown" @click.stop>
            <button type="button" class="quote-dropdown-trigger" :class="errors.purpose ? 'is-invalid' : ''" :aria-expanded="activeDropdown === 'purpose'" aria-haspopup="listbox" @click="toggleDropdown('purpose')">
              <span :class="form.purpose ? 'text-ink-900' : 'text-ink-400'">{{ form.purpose || 'Select purpose' }}</span>
              <ChevronDown :class="['w-4 h-4 text-ink-400 transition-transform', activeDropdown === 'purpose' ? 'rotate-180' : '']" />
            </button>
            <div v-if="activeDropdown === 'purpose'" class="quote-dropdown-menu" role="listbox">
              <button v-for="option in ['Reselling', 'End Use']" :key="option" type="button" role="option" :aria-selected="form.purpose === option" :class="['quote-dropdown-option', form.purpose === option ? 'is-selected' : '']" @click="chooseDropdown('purpose', option)">{{ option }}</button>
            </div>
          </div>
          <p v-if="errors.purpose" class="text-red-500 text-xs mt-1">{{ errors.purpose }}</p>
        </div>

        <div>
          <label for="requirements" class="block text-sm font-medium text-ink-700 mb-1.5">Project Requirements <span class="text-red-500">*</span></label>
          <textarea id="requirements" v-model="form.requirements" rows="4" required placeholder="Describe fabric specs, GSM, width, weave, application, delivery timeline, or sample needs..." :class="['input-field resize-none', errors.requirements ? 'border-red-400 focus:ring-red-400' : '']" @blur="validateField('requirements')"></textarea>
          <p v-if="errors.requirements" class="text-red-500 text-xs mt-1">{{ errors.requirements }}</p>
        </div>

        <button type="submit" :disabled="status === 'submitting'" class="w-full py-4 bg-brand-500 hover:bg-brand-600 disabled:bg-ink-400 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm">
          <svg v-if="status === 'submitting'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
          <span>{{ status === 'submitting' ? 'Submitting...' : 'Submit Quote Enquiry' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronDown } from 'lucide-vue-next';
import { useCategoryFlat } from '../composables/useCategories';
import { api } from '../services/api';
import { digitsOnly } from '../utils/phone';

const route = useRoute();

const { flat: categories } = useCategoryFlat();
const productOptions = ref([]);

const form = reactive({ name: '', company: '', email: '', phone: '', category: '', product: '', quantity: '', unit: 'Meter', purpose: '', requirements: '', honeypot: '' });
const errors = reactive({ name: '', email: '', phone: '', category: '', purpose: '', requirements: '' });
const status = ref('idle');
const errorMessage = ref('');
const activeDropdown = ref('');
const selectedCategoryName = computed(() => categories.value.find((category) => category.slug === form.category)?.name || '');

function toggleDropdown(name) {
  activeDropdown.value = activeDropdown.value === name ? '' : name;
}

function chooseDropdown(field, value) {
  form[field] = value;
  activeDropdown.value = '';
  if (field === 'category') validateField('category');
}

function closeDropdowns() {
  activeDropdown.value = '';
}

async function loadProductsForCategory(slug) {
  if (!slug) { productOptions.value = []; return; }
  try {
    const res = await api.products.list({ category: slug, limit: 500 });
    productOptions.value = res.data;
  } catch {
    productOptions.value = [];
  }
}

watch(() => form.category, (slug) => {
  loadProductsForCategory(slug);
  const stillValid = productOptions.value.some((p) => p.name === form.product);
  if (!stillValid) form.product = '';
});

const validateField = (field) => {
  errors[field] = '';
  if (field === 'name') {
    if (!form.name.trim()) errors.name = 'Full Name is required';
    else if (form.name.trim().length < 2) errors.name = 'Name is too short';
  }
  if (field === 'email') {
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address';
  }
  if (field === 'phone') {
    if (!form.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone)) errors.phone = 'Enter exactly 10 digits';
  }
  if (field === 'category' && !form.category) errors.category = 'Please select a category';
  if (field === 'purpose' && !form.purpose) errors.purpose = 'Please select the purpose of requirement';
  if (field === 'requirements') {
    if (!form.requirements.trim()) errors.requirements = 'Please describe your requirements';
    else if (form.requirements.trim().length < 10) errors.requirements = 'Please provide at least 10 characters';
  }
};

const validateForm = () => {
  ['name', 'email', 'phone', 'category', 'purpose', 'requirements'].forEach(validateField);
  return !errors.name && !errors.email && !errors.phone && !errors.category && !errors.purpose && !errors.requirements;
};

const handleSubmit = async () => {
  if (status.value === 'submitting') return;
  if (form.honeypot) { status.value = 'success'; return; }
  if (!validateForm()) return;

  status.value = 'submitting';
  errorMessage.value = '';

  try {
    const selectedCategory = categories.value.find((c) => c.slug === form.category);
    const selectedProduct = productOptions.value.find((p) => p.name === form.product);
    await api.enquiries.create({
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      category: selectedCategory ? selectedCategory.name : form.category,
      categoryId: selectedCategory ? selectedCategory.id : null,
      product: form.product,
      productId: selectedProduct ? selectedProduct.id : null,
      quantity: form.quantity ? Number(form.quantity) : null,
      unit: form.unit,
      purpose: form.purpose,
      requirements: form.requirements.trim(),
      sourcePage: route.path,
    });
    status.value = 'success';
  } catch (err) {
    status.value = 'error';
    errorMessage.value = err.message || 'Something went wrong. Please try again or contact us directly.';
  }
};

const resetForm = () => {
  Object.assign(form, { name: '', company: '', email: '', phone: '', category: '', product: '', quantity: '', unit: 'Meter', purpose: '', requirements: '', honeypot: '' });
  status.value = 'idle';
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
  const applyQueryParams = async () => {
    const queryProduct = route.query.product;
    const queryCategory = route.query.category;
    if (queryCategory) {
      const match = categories.value.find((c) => c.name.toLowerCase() === String(queryCategory).toLowerCase() || c.slug === queryCategory);
      form.category = match ? match.slug : '';
    }
    if (queryProduct) {
      if (form.category) await loadProductsForCategory(form.category);
      const match = productOptions.value.find((p) => p.name.toLowerCase() === String(queryProduct).toLowerCase() || p.slug === queryProduct);
      form.product = match ? match.name : String(queryProduct);
    }
  };

  if (categories.value.length > 0) {
    applyQueryParams();
  } else {
    const stop = watch(categories, (list) => {
      if (list.length > 0) { applyQueryParams(); stop(); }
    });
  }
});

onBeforeUnmount(() => document.removeEventListener('click', closeDropdowns));
</script>

<style>
.quote-form {
  background-image: linear-gradient(135deg, rgba(255, 247, 237, 0.42), transparent 35%);
}

.quote-dropdown {
  position: relative;
}

.quote-dropdown-trigger {
  width: 100%;
  min-height: 3rem;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #d6d3d1;
  border-radius: 0.75rem;
  color: #111827;
  font-size: 0.875rem;
  text-align: left;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.quote-dropdown-trigger:hover,
.quote-dropdown-trigger[aria-expanded='true'] {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.quote-dropdown-trigger.is-invalid {
  border-color: #f87171;
}

.quote-dropdown-menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  max-height: 14rem;
  overflow-y: auto;
  padding: 0.35rem;
  background: #fff;
  border: 1px solid #e7e5e4;
  border-radius: 0.9rem;
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.14);
}

.quote-dropdown-option {
  width: 100%;
  padding: 0.7rem 0.8rem;
  border-radius: 0.6rem;
  color: #334155;
  font-size: 0.875rem;
  text-align: left;
  transition: background-color 120ms ease, color 120ms ease;
}

.quote-dropdown-option:hover,
.quote-dropdown-option.is-selected {
  background: #fff7ed;
  color: #c2410c;
}

@media (max-width: 640px) {
  .quote-dropdown-menu {
    max-height: 12rem;
  }
}

@media (max-width: 640px) {
  .quote-form .bg-gradient-to-r {
    padding: 1.5rem 1.25rem;
  }
}
</style>

