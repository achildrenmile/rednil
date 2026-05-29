import { SITE_URL, CONTACT_EMAIL, LINKEDIN_URL } from './constants';

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Michael Linder',
  url: SITE_URL,
  email: CONTACT_EMAIL,
  sameAs: [LINKEDIN_URL],
  jobTitle: 'Solutions Architect',
  worksFor: {
    '@type': 'Organization',
    name: 'Strali Solutions e.U.',
    url: 'https://strali.solutions',
  },
  knowsAbout: [
    'Solutions Architecture',
    'Platform Engineering',
    'GitOps',
    'AI Governance',
    'EU AI Act',
    'Enterprise IT',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Noetsch im Gailtal',
    addressRegion: 'Carinthia',
    addressCountry: 'AT',
  },
};
