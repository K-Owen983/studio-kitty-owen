export const MOCK_USER = {
  uid: 'demo-user-kitty-owen',
  name: 'Kitty Owen',
  email: 'kitty@kittyowen.com',
  photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
};

export const INITIAL_PUBLICATIONS = [
  {
    id: 'pub-001',
    title: 'Toda acción comienza con una decisión',
    subtitle: 'Marco conceptual para la toma de decisiones estratégicas en contextos de alta incertidumbre.',
    excerpt: 'En organizaciones complejas, la claridad conceptual es la diferencia entre reaccionar y liderar. Este ensayo explora la intersección entre liderazgo y ciencia de datos.',
    contentJson: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'El arte de la decisión consciente' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Tomar decisiones no es simplemente elegir entre opciones visibles. Es estructurar el problema desde sus premisas fundamentales. Integra la ' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'comunicación estratégica' },
            { type: 'text', text: ' con la ciencia de datos para reducir la entropía organizacional.' }
          ]
        },
        {
          type: 'blockquote',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: '“Las mejores decisiones nacen de comprender mejor la realidad.”' }] }
          ]
        }
      ]
    },
    contentHtml: '<h2>El arte de la decisión consciente</h2><p>Tomar decisiones no es simplemente elegir entre opciones visibles. Es estructurar el problema desde sus premisas fundamentales. Integra la <strong>comunicación estratégica</strong> con la ciencia de datos para reducir la entropía organizacional.</p><blockquote><p>“Las mejores decisiones nacen de comprender mejor la realidad.”</p></blockquote>',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      alt: 'Decisión Estratégica'
    },
    type: 'Nota Estratégica',
    category: 'Liderazgo',
    tags: ['Estrategia', 'Decisiones', 'Liderazgo'],
    slug: 'toda-accion-comienza-con-una-decision',
    status: 'published',
    featured: true,
    visibility: 'public',
    readingTime: 3,
    author: {
      name: 'Kitty Owen',
      email: 'kitty@kittyowen.com',
      photoURL: MOCK_USER.photoURL
    },
    seo: {
      metaTitle: 'Toda acción comienza con una decisión | Kitty Owen',
      metaDescription: 'Marco conceptual para la toma de decisiones estratégicas en contextos de alta incertidumbre.'
    },
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    publishedAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'pub-002',
    title: 'Comunicación y Ciencia de Datos en la Era de la IA',
    subtitle: 'Cómo conectar la analítica avanzada con narrativas ejecutivas memorables.',
    excerpt: 'Los datos por sí solos no persuaden. Se requiere una arquitectura narrativa que convierta números en convicción estratégica.',
    contentJson: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'La convergencia de datos y lenguaje' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'La capacidad de sintetizar información compleja en mensajes claros es la habilidad más valiosa del siglo XXI.' }
          ]
        }
      ]
    },
    contentHtml: '<h2>La convergencia de datos y lenguaje</h2><p>La capacidad de sintetizar información compleja en mensajes claros es la habilidad más valiosa del siglo XXI.</p>',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      alt: 'Tecnología e Inteligencia Artificial'
    },
    type: 'Ensayo',
    category: 'Comunicación',
    tags: ['Comunicación', 'Ciencia de Datos', 'IA'],
    slug: 'comunicacion-y-ciencia-de-datos-en-la-era-de-la-ia',
    status: 'draft',
    featured: false,
    visibility: 'public',
    readingTime: 2,
    author: {
      name: 'Kitty Owen',
      email: 'kitty@kittyowen.com',
      photoURL: MOCK_USER.photoURL
    },
    seo: {
      metaTitle: 'Comunicación y Ciencia de Datos | Kitty Owen',
      metaDescription: 'Cómo conectar la analítica avanzada con narrativas ejecutivas memorables.'
    },
    createdAt: '2026-08-05T14:30:00.000Z',
    updatedAt: '2026-08-05T14:30:00.000Z',
    publishedAt: null
  }
];
