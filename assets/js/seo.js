/* ============================================
   CS15 Hub - SEO metadata manager
   Per-route titles, descriptions, canonical URLs,
   Open Graph, and structured data for the SPA.
   ============================================ */
window.SEO = (function () {
  'use strict';

  const siteName = 'CS15 Hub';
  const base = window.BASE_URL || '';
  const origin = window.location.origin;
  const root = origin + base + '/';
  const ogImageDefault = origin + base + '/assets/images/social-preview-1200x630.png';
  const orgId = 'seo-org-website';
  const breadcrumbId = 'seo-breadcrumb';
  const webpageId = 'seo-webpage';

  // Routes that are safe + valuable to index
  const INDEXABLE = ['/', '/about', '/projects', '/gallery', '/members', '/contact', '/terms', '/privacy'];

  const META = {
    '/': {
      title: 'CS15 Hub — Jazeera University Computer Science Batch 15',
      desc: "CS15 Hub is Jazeera University's portal for Computer Science Batch 15 — course tools, projects, messaging, elections, and the official BTCH 15-B Profiling class directory of 58 students.",
    },
    '/about': {
      title: 'About CS15 Hub — Jazeera University Computer Science Batch 15',
      desc: "CS15 Hub is Jazeera University's digital home for Computer Science Batch 15: course materials, assignments, projects, messaging, and the BTCH 15-B class profiling directory of 58 students.",
    },
    '/projects': {
      title: 'Student Projects — CS15 Hub, Jazeera University Batch 15',
      desc: 'Projects built by Computer Science Batch 15 students at Jazeera University, shared on CS15 Hub with code, tech stack, and live demos.',
    },
    '/gallery': {
      title: 'Gallery — CS15 Hub, Jazeera University Batch 15',
      desc: 'Photos and media from academic events, classes, and social moments of Jazeera University Computer Science Batch 15.',
    },
    '/members': {
      title: 'Class Directory (BTCH 15-B Profiling) — CS15 Hub',
      desc: 'The BTCH 15-B class directory of Jazeera University Computer Science & IT Batch 15: 58 documented classmates with their courses, learning styles, interests, and skills.',
    },
    '/contact': {
      title: 'Contact — CS15 Hub, Jazeera University Batch 15',
      desc: 'Get in touch with CS15 Hub, the Computer Science Batch 15 community at Jazeera University, Mogadishu.',
    },
    '/terms': {
      title: 'Terms of Service — CS15 Hub',
      desc: 'Terms of service for using CS15 Hub, the Computer Science Batch 15 platform at Jazeera University.',
    },
    '/privacy': {
      title: 'Privacy Policy — CS15 Hub',
      desc: 'How CS15 Hub handles student accounts, profiles, and data for Jazeera University Computer Science Batch 15.',
    },
  };

  function _normalizePath(raw) {
    raw = (raw || '').split('?')[0];
    return '/' + raw.replace(/^\/|\/$/g, '').split('/').filter(Boolean).join('/');
  }

  /** Route as the Router sees it (hash first, then clean path). */
  function currentRoute() {
    let raw = window.location.hash.replace(/^#/, '');
    if (!raw) {
      raw = window.location.pathname;
      if (base) {
        raw = raw.replace(new RegExp('^' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), '');
      }
    }
    return _normalizePath(raw);
  }

  function canonicalUrl(path) {
    if (path === '/') return root;
    return origin + base + path;
  }

  function metaFor(path) {
    if (META[path]) return META[path];
    if (path.indexOf('/posts/') === 0) {
      return {
        title: 'Article — ' + siteName + ', Jazeera University Code Batch 15',
        desc: 'A post from the Jazeera University Computer Science Batch 15 community.',
      };
    }
    return {
      title: siteName + ' — Jazeera University Computer Science Batch 15',
      desc: "CS15 Hub is Jazeera University's portal for Computer Science Batch 15 — course tools, projects, messaging, elections, and the official BTCH 15-B Profiling class directory of 58 students.",
    };
  }

  function setOrCreate(sel, attrs, tag, parent) {
    let el = document.querySelector(sel);
    if (!el) {
      el = document.createElement(tag || 'meta');
      (parent || document.head).appendChild(el);
    }
    Object.keys(attrs).forEach(function (k) {
      if (k in el) {
        el[k] = attrs[k];
      } else {
        el.setAttribute(k, attrs[k]);
      }
    });
    return el;
  }

  function upsertMeta(name, content) {
    let el = document.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function upsertProperty(property, content) {
    let el = document.querySelector('meta[property="' + property + '"], meta[name="' + property + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function applyMeta() {
    const path = currentRoute();
    const isPublicPost = path.indexOf('/posts/') === 0 && path !== '/posts';
    const indexable = INDEXABLE.indexOf(path) !== -1 || isPublicPost;
    const meta = metaFor(path);
    const url = canonicalUrl(path);

    document.title = meta.title;
    upsertMeta('description', meta.desc);
    upsertMeta('robots', indexable ? 'index, follow' : 'noindex, nofollow');

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);

    upsertProperty('og:site_name', siteName);
    upsertProperty('og:type', 'website');
    upsertProperty('og:title', meta.title);
    upsertProperty('og:description', meta.desc);
    upsertProperty('og:url', url);
    upsertProperty('og:image', ogImageDefault);
    upsertProperty('og:locale', 'en_US');
    upsertProperty('twitter:card', 'summary_large_image');
    upsertProperty('twitter:title', meta.title);
    upsertProperty('twitter:description', meta.desc);
    upsertProperty('twitter:image', ogImageDefault);

    injectOrganization(meta, url);
    if (indexable) {
      injectStructuredData(url, meta);
    } else {
      removeScript(breadcrumbId);
      removeScript(webpageId);
    }
  }

  function injectOrganization(meta, url) {
    if (document.getElementById(orgId)) return;
    const org = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': root + '#organization',
          name: 'Jazeera University CS & IT Batch 15',
          alternateName: ['CS15 Hub', 'CS Batch 15', 'BTCH 15-B'],
          url: root,
          logo: ogImageDefault,
          description: 'Student-built platform of Jazeera University Computer Science & IT Batch 15 (BTCH 15-B): class directory, projects, gallery, and community tools.',
          parentOrganization: {
            '@type': 'EducationalOrganization',
            name: 'Jazeera University',
            address: { '@type': 'PostalAddress', addressCountry: 'SO', addressLocality: 'Mogadishu' },
          },
        },
        {
          '@type': 'WebSite',
          '@id': root + '#website',
          name: siteName,
          url: root,
          publisher: { '@id': root + '#organization' },
          inLanguage: 'en',
        },
      ],
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = orgId;
    s.textContent = JSON.stringify(org);
    document.head.appendChild(s);
  }

  function injectStructuredData(url, meta) {
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: root },
        { '@type': 'ListItem', position: 2, name: meta.title, item: url },
      ],
    };
    upsertScript(breadcrumbId, breadcrumb);

    const webpage = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: meta.title,
      description: meta.desc,
      url: url,
      isPartOf: { '@id': root + '#website' },
      about: { '@id': root + '#organization' },
    };
    upsertScript(webpageId, webpage);
  }

  function upsertScript(id, data) {
    let s = document.getElementById(id);
    if (!s) {
      s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = id;
      document.head.appendChild(s);
    }
    s.textContent = JSON.stringify(data);
  }

  function removeScript(id) {
    const el = document.getElementById(id);
    if (el) el.parentNode.removeChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyMeta);
  } else {
    applyMeta();
  }
  window.addEventListener('hashchange', applyMeta);

  return { applyMeta: applyMeta, currentRoute: currentRoute };
})();