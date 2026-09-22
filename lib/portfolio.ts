export const categories = [
  'Corrimãos e escadas',
  'Portões e serralheria',
  'Estruturas metálicas',
  'Coberturas',
  'Fachadas em ACM',
  'Reformas e acabamentos',
] as const;
export type Category = (typeof categories)[number];
export type Project = {
  id: string;
  title: string;
  category: Category;
  description: string;
  location: string;
  images: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export const featuredProjects: Project[] = [
  {
    id: 'titanio-escada-corrimaos',
    title: 'Escada metálica com corrimãos e proteção lateral',
    category: 'Corrimãos e escadas',
    description:
      'Escada metálica com corrimãos contínuos e fechamento lateral em tela para uma circulação mais protegida.',
    location: '',
    images: [
      '/trabalhos/escada-metalica-preta.jpeg',
      '/trabalhos/corrimaos-escada-verde.jpeg',
    ],
    published: true,
    created_at: '2026-09-14T20:42:37.000Z',
    updated_at: '2026-09-14T20:42:37.000Z',
  },
  {
    id: 'titanio-gradil-branco',
    title: 'Gradil metálico para área externa',
    category: 'Portões e serralheria',
    description:
      'Gradil metálico branco para fechamento e proteção do perímetro externo.',
    location: '',
    images: ['/trabalhos/gradil-branco.jpeg'],
    published: true,
    created_at: '2026-09-14T20:42:35.000Z',
    updated_at: '2026-09-14T20:42:35.000Z',
  },
  {
    id: 'titanio-portao-residencial',
    title: 'Conjunto de portões metálicos sob medida',
    category: 'Portões e serralheria',
    description:
      'Portões de garagem e acesso social fabricados em metal, com desenho coordenado e acabamento cinza.',
    location: '',
    images: ['/trabalhos/portao-metalico-cinza.jpeg'],
    published: true,
    created_at: '2026-09-14T20:43:43.000Z',
    updated_at: '2026-09-14T20:43:43.000Z',
  },
  {
    id: 'titanio-estrutura-galpao',
    title: 'Estrutura metálica para galpão',
    category: 'Estruturas metálicas',
    description:
      'Montagem de treliças e estrutura metálica de galpão em diferentes etapas da obra.',
    location: '',
    images: [
      '/trabalhos/estrutura-galpao-trelicas.jpeg',
      '/trabalhos/estrutura-metalica-industrial.jpeg',
    ],
    published: true,
    created_at: '2026-09-14T20:47:44.000Z',
    updated_at: '2026-09-14T20:47:44.000Z',
  },
  {
    id: 'titanio-cobertura-metalica',
    title: 'Cobertura com treliças metálicas',
    category: 'Coberturas',
    description:
      'Estrutura de cobertura em treliças metálicas com fechamento em telhas.',
    location: '',
    images: ['/trabalhos/cobertura-metalica.jpeg'],
    published: true,
    created_at: '2026-09-14T20:47:59.000Z',
    updated_at: '2026-09-14T20:47:59.000Z',
  },
  {
    id: 'titanio-mobiliario-metalico',
    title: 'Mesa e bancos com estrutura metálica',
    category: 'Portões e serralheria',
    description:
      'Conjunto de mesa e bancos com bases metálicas e acabamento em preto e branco.',
    location: '',
    images: ['/trabalhos/mobiliario-metalico.jpeg'],
    published: true,
    created_at: '2026-09-14T20:43:39.000Z',
    updated_at: '2026-09-14T20:43:39.000Z',
  },
];

export const photoUrl = (key: string) =>
  key.startsWith('/') ? key : `/api/fotos/${encodeURIComponent(key)}`;
export const instagramHandle = 'titanium.s.integrados';
export const instagramUrl = `https://www.instagram.com/${instagramHandle}/`;
export function quoteUrl(subject?: string) {
  return `https://wa.me/5511948507339?text=${encodeURIComponent(
    subject
      ? `Olá! Vi ${subject} no site da Titânio e gostaria de conversar sobre meu projeto e combinar uma avaliação no local.`
      : 'Olá! Vim pelo site da Titânio Serviços Integrados e gostaria de conversar sobre meu projeto e combinar uma avaliação no local.',
  )}`;
}
