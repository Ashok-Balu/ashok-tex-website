const API_BASE = '/api';
import { ref } from 'vue';
import { useAdminNotifications } from '../composables/useAdminNotifications';

const requestCache = new Map();
const activeRequests = new Map();
const CACHE_TTL_MS = 30000;

export const apiLoading = ref(false);
let pendingApiRequests = 0;

export function invalidateApiCache(prefix = '') {
  if (!prefix) return;
  for (const key of requestCache.keys()) {
    if (key.includes(prefix)) requestCache.delete(key);
  }
}

function beginApiRequest() {
  pendingApiRequests += 1;
  apiLoading.value = true;
}

function endApiRequest() {
  pendingApiRequests = Math.max(0, pendingApiRequests - 1);
  if (pendingApiRequests === 0) apiLoading.value = false;
}

function normalizeImageValue(image) {
  if (typeof image === 'string') return image;
  if (image && typeof image === 'object') return image.url || image.src || '';
  return '';
}

function normalizeProduct(product) {
  if (!product || typeof product !== 'object') return product;
  const images = Array.isArray(product.images) ? product.images.map(normalizeImageValue).filter(Boolean) : [];
  return { ...product, images };
}

async function request(path, { method = 'GET', body, auth = false, isFormData = false, cache = false } = {}) {
  beginApiRequest();
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = localStorage.getItem('ashoktex_admin_token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const cacheKey = `${method}:${path}`;
  if (cache && method === 'GET') {
    const cached = requestCache.get(cacheKey);
    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      endApiRequest();
      return cached.data;
    }
    const inFlight = activeRequests.get(cacheKey);
    if (inFlight) {
      endApiRequest();
      return inFlight;
    }
  }

  const requestPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      });

      let json = null;
      try { json = await res.json(); } catch { /* no JSON body */ }

      const { notify } = useAdminNotifications();
      if (!res.ok) {
        const message = json?.message || `Request failed (${res.status})`;
        if (auth) {
          notify(message, 'error');
          if (res.status === 401) {
            localStorage.removeItem('ashoktex_admin_token');
            localStorage.removeItem('ashoktex_admin_user');
            if (window.location.pathname.startsWith('/admin')) {
              window.location.href = '/admin/login';
            }
          }
        }
        const error = new Error(message);
        error.status = res.status;
        error.payload = json;
        throw error;
      }
      if (auth && method !== 'GET') notify('Changes saved successfully.');
      if (cache && method === 'GET') requestCache.set(cacheKey, { createdAt: Date.now(), data: json });
      if (method !== 'GET' && auth) invalidateApiCache('/admin');
      return json;
    } finally {
      if (cache && method === 'GET') activeRequests.delete(cacheKey);
      endApiRequest();
    }
  })();

  if (cache && method === 'GET') activeRequests.set(cacheKey, requestPromise);

  return requestPromise;
}

// ─── Public API ─────────────────────────────────────────────────────────────
export const api = {
  categories: {
    tree: () => request('/categories', { cache: true }),
    flat: () => request('/categories/flat', { cache: true }),
    bySlug: (slug) => request(`/categories/${encodeURIComponent(slug)}`, { cache: true }),
  },
  products: {
    list: (params = {}) => request(`/products?${new URLSearchParams(cleanParams(params))}`, { cache: true }),
    filters: (category) => request(`/products/filters${category ? `?category=${encodeURIComponent(category)}` : ''}`, { cache: true }),
    bySlug: (slug) => request(`/products/${encodeURIComponent(slug)}`, { cache: true }),
  },
  testimonials: {
    list: () => request('/testimonials'),
  },
  settings: {
    company: () => request('/settings/company'),
    navigation: () => request('/settings/navigation'),
    homepageSections: () => request('/settings/homepage-sections'),
  },
  enquiries: {
    create: (data) => request('/enquiries', { method: 'POST', body: data }),
  },
  contact: {
    send: (data) => request('/contact', { method: 'POST', body: data }),
  },
  analytics: {
    visit: (data) => request('/analytics/visit', { method: 'POST', body: data }),
  },
};

// ─── Admin API (requires auth token) ────────────────────────────────────────
export const adminApi = {
  login: (username, password) => request('/admin/auth/login', { method: 'POST', body: { username, password } }),
  dashboard: () => request('/admin/dashboard', { auth: true }),

  categories: {
    list: () => request('/admin/categories', { auth: true }),
    tree: () => request('/admin/categories/tree', { auth: true }),
    get: (id) => request(`/admin/categories/${id}`, { auth: true }),
    create: (data) => request('/admin/categories', { method: 'POST', body: data, auth: true }),
    update: (id, data) => request(`/admin/categories/${id}`, { method: 'PUT', body: data, auth: true }),
    remove: (id) => request(`/admin/categories/${id}`, { method: 'DELETE', auth: true }),
    reorder: (orderedIds) => request('/admin/categories/reorder', { method: 'PUT', body: { orderedIds }, auth: true }),
  },
  products: {
    list: (params = {}) => request(`/admin/products?${new URLSearchParams(cleanParams(params))}`, { auth: true }),
    get: (id) => request(`/admin/products/${id}`, { auth: true }),
    create: (data) => request('/admin/products', { method: 'POST', body: data, auth: true }),
    update: (id, data) => request(`/admin/products/${id}`, { method: 'PUT', body: data, auth: true }),
    remove: (id) => request(`/admin/products/${id}`, { method: 'DELETE', auth: true }),
    duplicate: (id) => request(`/admin/products/${id}/duplicate`, { method: 'POST', auth: true }),
    reorder: (orderedIds) => request('/admin/products/reorder', { method: 'PUT', body: { orderedIds }, auth: true }),
  },
  testimonials: {
    list: (params = {}) => request(`/admin/testimonials?${new URLSearchParams(cleanParams(params))}`, { auth: true }),
    create: (data) => request('/admin/testimonials', { method: 'POST', body: data, auth: true }),
    update: (id, data) => request(`/admin/testimonials/${id}`, { method: 'PUT', body: data, auth: true }),
    remove: (id) => request(`/admin/testimonials/${id}`, { method: 'DELETE', auth: true }),
    reorder: (orderedIds) => request('/admin/testimonials/reorder', { method: 'PUT', body: { orderedIds }, auth: true }),
  },
  enquiries: {
    list: (params = {}) => request(`/admin/enquiries?${new URLSearchParams(cleanParams(params))}`, { auth: true }),
    updateStatus: (id, status) => request(`/admin/enquiries/${id}/status`, { method: 'PUT', body: { status }, auth: true }),
    remove: (id) => request(`/admin/enquiries/${id}`, { method: 'DELETE', auth: true }),
  },
  contacts: {
    list: (params = {}) => request(`/admin/enquiries/contacts?${new URLSearchParams(cleanParams(params))}`, { auth: true }),
    updateStatus: (id, status) => request(`/admin/enquiries/contacts/${id}/status`, { method: 'PUT', body: { status }, auth: true }),
    remove: (id) => request(`/admin/enquiries/contacts/${id}`, { method: 'DELETE', auth: true }),
  },
  settings: {
    company: () => request('/admin/settings/company', { auth: true }),
    updateCompany: (data) => request('/admin/settings/company', { method: 'PUT', body: data, auth: true }),
    navigation: () => request('/admin/settings/navigation', { auth: true }),
    createNavItem: (data) => request('/admin/settings/navigation', { method: 'POST', body: data, auth: true }),
    updateNavItem: (id, data) => request(`/admin/settings/navigation/${id}`, { method: 'PUT', body: data, auth: true }),
    removeNavItem: (id) => request(`/admin/settings/navigation/${id}`, { method: 'DELETE', auth: true }),
    reorderNavItems: (orderedIds) => request('/admin/settings/navigation/reorder', { method: 'PUT', body: { orderedIds }, auth: true }),
    homepageSections: () => request('/admin/settings/homepage-sections', { auth: true }),
    updateHomepageSection: (key, data) => request(`/admin/settings/homepage-sections/${key}`, { method: 'PUT', body: data, auth: true }),
  },
  upload: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return request('/admin/upload', { method: 'POST', body: formData, auth: true, isFormData: true });
  },
};

function cleanParams(params) {
  const out = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') out[key] = value;
  }
  return out;
}
