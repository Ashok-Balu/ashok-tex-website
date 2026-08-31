export function injectStructuredData(schemaObj, id = 'structured-data-script') {
  if (typeof document === 'undefined') return;
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObj);
}

export function getOrganizationSchema(companyInfo) {
  if (!companyInfo) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": companyInfo.name,
    "image": "https://www.ashoktex.in/favicon.svg",
    "telephone": companyInfo.phoneRaw,
    "email": companyInfo.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": companyInfo.address?.street,
      "addressLocality": companyInfo.address?.city,
      "addressRegion": companyInfo.address?.state,
      "postalCode": companyInfo.address?.pincode,
      "addressCountry": "IN"
    },
    "founder": {
      "@type": "Person",
      "name": companyInfo.founder
    },
    "foundingDate": String(companyInfo.establishedYear || ''),
    "url": companyInfo.website || "https://www.ashoktex.in",
    "priceRange": "$$",
    "description": `Manufacturer and wholesale supplier of textile fabrics in ${companyInfo.address?.city || 'Karur'}, ${companyInfo.address?.state || 'Tamil Nadu'}.`
  };
}

export function getProductSchema(product, companyName = 'Ashok Tex') {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": companyName
    },
    "category": product.category,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": companyName
      }
    }
  };
}

export function getBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": "https://www.ashoktex.in" + item.path
    }))
  };
}