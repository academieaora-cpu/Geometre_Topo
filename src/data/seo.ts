/**
 * Données structurées (JSON-LD). Uniquement des informations réelles et validées :
 * aucune note, aucun avis, aucune adresse ni aucun prix n'est déclaré.
 */
import { site } from '../config/site.ts';
import type { Service } from './services.ts';

export function organizationJsonLd(base: URL): Record<string, unknown> {
  const url = base.href.replace(/\/$/, '');
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${url}/#entreprise`,
    name: site.name,
    description: site.description,
    url,
    logo: `${url}/images/logo-192.webp`,
    image: `${url}/images/og-geometre-topo.jpg`,
    areaServed: site.areaServed.map((name) => ({ '@type': 'City', name })),
    knowsLanguage: 'fr',
    founder: {
      '@type': 'Person',
      '@id': `${url}/a-propos#personne`,
      name: site.owner,
      jobTitle: site.ownerTitle,
    },
  };
  if (site.phone) data.telephone = site.phone;
  if (site.email) data.email = site.email;
  if (site.socials.length) data.sameAs = site.socials;
  return data;
}

export function breadcrumbJsonLd(base: URL, items: { name: string; href: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.href, base).href,
    })),
  };
}

export function serviceJsonLd(base: URL, service: Service): Record<string, unknown> {
  const url = base.href.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.name,
    description: service.metaDescription,
    url: `${url}/services/${service.slug}`,
    provider: { '@id': `${url}/#entreprise` },
    areaServed: site.areaServed.map((name) => ({ '@type': 'City', name })),
  };
}

export function personJsonLd(base: URL): Record<string, unknown> {
  const url = base.href.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${url}/a-propos#personne`,
    name: site.owner,
    jobTitle: site.ownerTitle,
    image: `${url}/images/photos/portrait-alain-stephane-olouou-720.webp`,
    worksFor: { '@id': `${url}/#entreprise` },
    workLocation: { '@type': 'City', name: site.city },
  };
}
