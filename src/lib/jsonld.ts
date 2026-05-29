import { SITE_URL, CONTACT_EMAIL, LINKEDIN_URL, GITHUB_URL } from './constants';

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Michael Linder',
  url: SITE_URL,
  email: CONTACT_EMAIL,
  sameAs: [
    LINKEDIN_URL,
    GITHUB_URL,
    'https://x.com/achildrenmile',
    'https://strali.solutions',
  ],
  jobTitle: 'Solutions Architect',
  worksFor: {
    '@type': 'Organization',
    name: 'Strali Solutions e.U.',
    url: 'https://strali.solutions',
  },
  knowsAbout: [
    'Solutions Architecture',
    'Software Architecture',
    'AI Integration',
    'AI Governance',
    'EU AI Act',
    'Microsoft 365',
    'Enterprise IT',
    'DevOps',
    'Amateur Radio',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Noetsch im Gailtal',
    addressRegion: 'Carinthia',
    addressCountry: 'AT',
  },
};
