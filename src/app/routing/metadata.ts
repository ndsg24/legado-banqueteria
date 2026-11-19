export default {
  '/': {
    title: 'home.meta.title',
    description: 'home.meta.description',
    heading: 'home.meta.heading',
    canonical: 'https://ndsg24.github.io/legado-banqueteria/',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://ndsg24.github.io/legado-banqueteria/#website',
          url: 'https://ndsg24.github.io/legado-banqueteria/',
          name: 'Legado Banquetería',
          inLanguage: 'es-CL',
        },
        {
          '@type': 'LocalBusiness',
          '@id': 'https://ndsg24.github.io/legado-banqueteria/#business',
          name: 'Legado Banquetería',
          url: 'https://ndsg24.github.io/legado-banqueteria/',
          description: 'home.meta.businessDescription',
          image: 'https://ndsg24.github.io/legado-banqueteria/images/hero-table.jpg',
          email: 'legadobanqueteria@gmail.com',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Concepción',
            addressRegion: 'Biobío',
            addressCountry: 'CL',
          },
          areaServed: {
            '@type': 'City',
            name: 'Concepción',
          },
        },
        {
          '@type': 'Service',
          '@id': 'https://ndsg24.github.io/legado-banqueteria/#service',
          name: 'home.meta.serviceName',
          serviceType: 'common.nav.brandTagline',
          provider: {
            '@id': 'https://ndsg24.github.io/legado-banqueteria/#business',
          },
          areaServed: {
            '@type': 'City',
            name: 'Concepción',
          },
        },
      ],
    },
  },
  '/carta.html': {
    title: 'catalog.meta.title',
    description: 'catalog.meta.description',
    heading: 'catalog.intro.eyebrow',
    canonical: 'https://ndsg24.github.io/legado-banqueteria/carta.html',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': 'https://ndsg24.github.io/legado-banqueteria/carta.html#page',
      url: 'https://ndsg24.github.io/legado-banqueteria/carta.html',
      name: 'catalog.intro.eyebrow',
      description: 'catalog.meta.description',
      inLanguage: 'es-CL',
      isPartOf: {
        '@id': 'https://ndsg24.github.io/legado-banqueteria/#website',
      },
      publisher: {
        '@id': 'https://ndsg24.github.io/legado-banqueteria/#business',
      },
    },
  },
  '/ambientacion.html': {
    title: 'table.meta.title',
    description: 'table.meta.description',
    heading: 'table.meta.heading',
    canonical: 'https://ndsg24.github.io/legado-banqueteria/ambientacion.html',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://ndsg24.github.io/legado-banqueteria/ambientacion.html#page',
      url: 'https://ndsg24.github.io/legado-banqueteria/ambientacion.html',
      name: 'table.meta.heading',
      description: 'table.meta.description',
      inLanguage: 'es-CL',
      isPartOf: {
        '@id': 'https://ndsg24.github.io/legado-banqueteria/#website',
      },
      publisher: {
        '@id': 'https://ndsg24.github.io/legado-banqueteria/#business',
      },
    },
  },
  '/cotizar.html': {
    title: 'quote.meta.title',
    description: 'quote.meta.description',
    heading: 'quote.meta.heading',
    canonical: 'https://ndsg24.github.io/legado-banqueteria/cotizar.html',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': 'https://ndsg24.github.io/legado-banqueteria/cotizar.html#page',
      url: 'https://ndsg24.github.io/legado-banqueteria/cotizar.html',
      name: 'quote.meta.heading',
      description: 'quote.meta.description',
      inLanguage: 'es-CL',
      isPartOf: {
        '@id': 'https://ndsg24.github.io/legado-banqueteria/#website',
      },
      publisher: {
        '@id': 'https://ndsg24.github.io/legado-banqueteria/#business',
      },
    },
  },
} as const
