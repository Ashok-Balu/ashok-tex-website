import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import CollectionsView from '../views/CollectionsView.vue';
import CollectionDetailView from '../views/CollectionDetailView.vue';
import ProductsView from '../views/ProductsView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import WhyAshokTexView from '../views/WhyAshokTexView.vue';
import RequestQuoteView from '../views/RequestQuoteView.vue';
import ContactView from '../views/ContactView.vue';
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue';
import TermsView from '../views/TermsView.vue';
import TestimonialsView from '../views/TestimonialsView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import { useAdminAuth } from '../composables/useAdminAuth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Ashok Tex | Textile Fabric Manufacturer & Supplier in Karur',
      description: 'Ashok Tex is a textile fabric manufacturer and supplier in Karur, Tamil Nadu. Cotton, Woven & Recycled fabrics. Est. 1995.',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      title: 'About Ashok Tex | Textile Manufacturer Est. 1995 in Karur',
      description: 'About Ashok Tex — founded in 1995 by Mr. Balusamy.M in Karur. Three decades of cotton, woven and recycled textile manufacturing.',
    },
  },
  {
    path: '/collections',
    name: 'Collections',
    component: CollectionsView,
    meta: {
      title: 'Fabric Collections | Ashok Tex',
      description: 'Explore Ashok Tex fabric collections, manufactured in Karur, Tamil Nadu.',
    },
  },
  // A single reusable category page handles every category/subcategory the admin creates.
  {
    path: '/collections/:category',
    name: 'CollectionDetail',
    component: CollectionDetailView,
    meta: { title: 'Fabric Collection | Ashok Tex Karur' },
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: {
      title: 'Textile Fabrics | Ashok Tex',
      description: 'Browse all fabric products from Ashok Tex — direct wholesale mill supply from Karur, Tamil Nadu.',
    },
  },
  // A single reusable product page handles every product the admin creates — no per-product routes.
  {
    path: '/products/:slug',
    name: 'ProductDetail',
    component: ProductDetailView,
    meta: { title: 'Fabric Details | Ashok Tex Karur' },
  },
  {
    path: '/why-ashok-tex',
    name: 'WhyAshokTex',
    component: WhyAshokTexView,
    meta: {
      title: 'Why Choose Ashok Tex | Trusted Textile Manufacturer in Karur',
      description: 'Why choose Ashok Tex - established 1995, quality focused, pan-India supply, cotton woven and recycled fabric manufacturer.',
    },
  },
  {
    path: '/testimonials',
    name: 'Testimonials',
    component: TestimonialsView,
    meta: {
      title: 'Customer Testimonials | Ashok Tex Fabric Manufacturer',
      description: 'What customers say about Ashok Tex - testimonials from garment manufacturers and textile buyers across India.',
    },
  },
  {
    path: '/request-quote',
    name: 'RequestQuote',
    component: RequestQuoteView,
    meta: {
      title: 'Request a Quote | Ashok Tex Fabric Manufacturer Karur',
      description: 'Request a fabric quote from Ashok Tex, Karur. Get direct mill pricing for cotton, woven and recycled fabrics.',
    },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView,
    meta: {
      title: 'Contact Ashok Tex | Textile Fabric Manufacturer in Karur',
      description: 'Contact Ashok Tex in Karur, Tamil Nadu. Phone: +91 7904154775. Email: arvinthas4@gmail.com.',
    },
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicyView,
    meta: { title: 'Privacy Policy | Ashok Tex', description: 'Privacy policy for Ashok Tex website.' },
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsView,
    meta: { title: 'Terms & Conditions | Ashok Tex', description: 'Terms and conditions for Ashok Tex wholesale fabric supply.' },
  },

  // ─── Admin Panel (CMS) ────────────────────────────────────────────────────
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../admin/views/AdminLogin.vue'),
    meta: { title: 'Admin Login | Ashok Tex', isAdmin: true, public: true },
  },
  {
    path: '/admin',
    component: () => import('../admin/AdminLayout.vue'),
    meta: { isAdmin: true, requiresAuth: true },
    children: [
      { path: '', name: 'AdminDashboard', component: () => import('../admin/views/AdminDashboard.vue'), meta: { title: 'Dashboard | Admin' } },
      { path: 'categories', name: 'AdminCategories', component: () => import('../admin/views/AdminCategories.vue'), meta: { title: 'Categories | Admin' } },
      { path: 'categories/new', name: 'AdminCategoryNew', component: () => import('../admin/views/AdminCategoryForm.vue'), meta: { title: 'New Category | Admin' } },
      { path: 'categories/:id/edit', name: 'AdminCategoryEdit', component: () => import('../admin/views/AdminCategoryForm.vue'), meta: { title: 'Edit Category | Admin' } },
      { path: 'products', name: 'AdminProducts', component: () => import('../admin/views/AdminProducts.vue'), meta: { title: 'Products | Admin' } },
      { path: 'products/new', name: 'AdminProductNew', component: () => import('../admin/views/AdminProductForm.vue'), meta: { title: 'New Product | Admin' } },
      { path: 'products/:id/edit', name: 'AdminProductEdit', component: () => import('../admin/views/AdminProductForm.vue'), meta: { title: 'Edit Product | Admin' } },
      { path: 'testimonials', name: 'AdminTestimonials', component: () => import('../admin/views/AdminTestimonials.vue'), meta: { title: 'Testimonials | Admin' } },
      { path: 'enquiries', name: 'AdminEnquiries', component: () => import('../admin/views/AdminEnquiries.vue'), meta: { title: 'Enquiries | Admin' } },
      { path: 'company', name: 'AdminCompany', component: () => import('../admin/views/AdminCompanySettings.vue'), meta: { title: 'Company Settings | Admin' } },
      { path: 'social', name: 'AdminSocial', component: () => import('../admin/views/AdminSocialSEO.vue'), meta: { title: 'Social & SEO | Admin' } },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: '404 - Page Not Found | Ashok Tex' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    // Force-disable smooth scrolling for this jump via inline style (which beats any
    // class-based `scroll-behavior: smooth` still active on <html>, e.g. from a stale
    // cached index.html) — an animated scroll here can get clamped mid-way when the
    // outgoing/incoming page heights differ, leaving the new page scrolled to its bottom.
    if (typeof document !== 'undefined') document.documentElement.style.scrollBehavior = 'auto';
    return { top: 0, left: 0 };
  },
});

router.beforeEach((to) => {
  if (to.meta?.requiresAuth) {
    const { isAuthenticated } = useAdminAuth();
    if (!isAuthenticated()) {
      return { name: 'AdminLogin', query: { redirect: to.fullPath } };
    }
  }
  return true;
});

router.afterEach((to) => {
  const title = to.meta?.title || 'Ashok Tex | Textile Fabric Manufacturer';
  const description = to.meta?.description || 'Ashok Tex textile fabric manufacturer and wholesale supplier in Karur, Tamil Nadu.';
  const canonicalUrl = `${window.location.origin}${to.fullPath.split('?')[0]}`.replace(/\/$/, '') || window.location.origin;
  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);
  const setMeta = (attribute, value, content) => {
    let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
    if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, value); document.head.appendChild(element); }
    element.setAttribute('content', content);
  };
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = canonicalUrl;
});

export default router;

