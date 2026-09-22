// The hero uses a licensed reference photo. Service cards use Titânio's own
// photographs, except for the metal-structure card kept at the owner's request.
export const weldingPhoto = {
  src: '/soldagem-real.jpeg',
  alt: 'Profissional com máscara e luvas soldando metal em uma oficina — foto de referência',
  width: 1280,
  height: 853,
  author: 'Tima Miroshnichenko',
  provider: 'Pexels',
  source:
    'https://www.pexels.com/photo/a-person-welding-at-a-workshop-5846247/',
};

export type ServicePhotoKey =
  | 'corrimaos'
  | 'escadas'
  | 'portoes'
  | 'grades'
  | 'estruturas'
  | 'coberturas';
type ServicePhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
  fit?: 'cover' | 'contain';
};

export const servicePhotos: Record<ServicePhotoKey, ServicePhoto> = {
  corrimaos: {
    src: '/trabalhos/corrimaos-escada-verde.jpeg',
    alt: 'Corrimãos metálicos verdes instalados em escada pela Titânio',
    width: 1280,
    height: 720,
    position: '50% 48%',
  },
  escadas: {
    src: '/trabalhos/escada-metalica-preta.jpeg',
    alt: 'Escada metálica preta com corrimãos e fechamento em tela executada pela Titânio',
    width: 1280,
    height: 720,
    position: '50% 54%',
  },
  portoes: {
    src: '/trabalhos/portao-metalico-cinza.jpeg',
    alt: 'Conjunto de portões metálicos cinza fabricado e instalado pela Titânio',
    width: 1280,
    height: 960,
    position: '50% 50%',
  },
  grades: {
    src: '/trabalhos/gradil-branco.jpeg',
    alt: 'Gradil metálico branco instalado pela Titânio no perímetro de um condomínio',
    width: 1599,
    height: 899,
    position: '50% 50%',
  },
  estruturas: {
    src: '/services/estrutura-metalica.jpg',
    alt: 'Estrutura metálica de galpão em construção, com vigas, pilares e mezanino — referência',
    width: 800,
    height: 600,
    fit: 'contain',
  },
  coberturas: {
    src: '/trabalhos/cobertura-metalica.jpeg',
    alt: 'Cobertura metálica com telhas e treliças executada pela Titânio',
    width: 1280,
    height: 720,
    position: '50% 45%',
  },
};
