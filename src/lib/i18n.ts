export const defaultLocale = 'de' as const;
export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const ui = {
  de: {
    'site.title': 'Michael Linder',
    'site.description': 'Solutions Architect · AI Governance · Enterprise IT',
    'nav.home': 'Start',
    'nav.about': 'Über mich',
    'nav.blog': 'Blog',
    'nav.projects': 'Projekte',
    'nav.contact': 'Kontakt',
    'footer.strali': 'Beruflich tätig über Strali Solutions e.U.',
    'footer.imprint': 'Impressum',
    'footer.privacy': 'Datenschutz',
    'blog.readmore': 'Weiterlesen',
    'blog.readingtime': 'Min. Lesezeit',
    'blog.tags': 'Themen',
    'blog.allposts': 'Alle Beiträge',
    'footer.ai': 'KI-Transparenz',
  },
  en: {
    'site.title': 'Michael Linder',
    'site.description': 'Solutions Architect · AI Governance · Enterprise IT',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'footer.strali': 'Professionally active via Strali Solutions e.U.',
    'footer.imprint': 'Imprint',
    'footer.privacy': 'Privacy',
    'blog.readmore': 'Read more',
    'blog.readingtime': 'min read',
    'blog.tags': 'Topics',
    'blog.allposts': 'All posts',
    'footer.ai': 'AI Transparency',
  },
} as const;

export function t(key: keyof (typeof ui)['de'], locale: Locale = defaultLocale): string {
  return ui[locale][key] ?? ui[defaultLocale][key] ?? key;
}

export function getLocalePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

export function getLocaleFromPath(path: string): Locale {
  const segment = path.split('/')[1];
  if (locales.includes(segment as Locale) && segment !== defaultLocale) {
    return segment as Locale;
  }
  return defaultLocale;
}

export function getAlternateLocalePath(currentPath: string, targetLocale: Locale): string {
  const currentLocale = getLocaleFromPath(currentPath);
  let basePath = currentPath;

  // Strip current locale prefix if non-default
  if (currentLocale !== defaultLocale) {
    basePath = currentPath.replace(`/${currentLocale}`, '') || '/';
  }

  // Map DE paths to EN equivalents and vice versa
  const pathMap: Record<string, string> = {
    '/ueber-mich': '/about',
    '/about': '/ueber-mich',
    '/kontakt': '/contact',
    '/contact': '/kontakt',
    '/impressum': '/imprint',
    '/imprint': '/impressum',
    '/datenschutz': '/privacy',
    '/privacy': '/datenschutz',
    '/ki-transparenz': '/ai-transparency',
    '/ai-transparency': '/ki-transparenz',
    '/projekte': '/projects',
    '/projects': '/projekte',
    // Blog posts with differing slugs per language (same-slug posts need no entry)
    '/blog/erst-das-problem-dann-das-werkzeug': '/blog/problem-first-then-tool',
    '/blog/problem-first-then-tool': '/blog/erst-das-problem-dann-das-werkzeug',
    '/blog/eu-ai-act-kmu-dach': '/blog/eu-ai-act-sme-dach',
    '/blog/eu-ai-act-sme-dach': '/blog/eu-ai-act-kmu-dach',
    '/blog/loop-engineering-der-loop-ist-der-billige-teil': '/blog/loop-engineering-the-loop-is-the-cheap-part',
    '/blog/loop-engineering-the-loop-is-the-cheap-part': '/blog/loop-engineering-der-loop-ist-der-billige-teil',
    '/blog/programmieren-vs-entwickeln': '/blog/programming-vs-development',
    '/blog/programming-vs-development': '/blog/programmieren-vs-entwickeln',
    '/blog/ki-agent-baut-werkzeug-experiment': '/blog/ai-agent-builds-a-tool-experiment',
    '/blog/ai-agent-builds-a-tool-experiment': '/blog/ki-agent-baut-werkzeug-experiment',
  };

  // Built paths carry a trailing slash; pathMap keys do not. Normalize for lookup, then restore.
  const hadTrailingSlash = basePath.length > 1 && basePath.endsWith('/');
  const lookupPath = hadTrailingSlash ? basePath.slice(0, -1) : basePath;
  const mappedPath = pathMap[lookupPath] ?? lookupPath;
  const restore = (p: string): string => (p === '/' || !hadTrailingSlash ? p : `${p}/`);

  if (targetLocale === defaultLocale) {
    return restore(mappedPath);
  }
  return `/${targetLocale}${restore(mappedPath)}`;
}
