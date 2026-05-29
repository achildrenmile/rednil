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
    'nav.now': 'Now',
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
    'nav.now': 'Now',
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
  };

  if (targetLocale === defaultLocale) {
    return pathMap[basePath] ?? basePath;
  }

  const mappedPath = pathMap[basePath] ?? basePath;
  return `/${targetLocale}${mappedPath}`;
}
