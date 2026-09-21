// Licensed third-party photographs. Never insert these into the business projects table.
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
  author: string;
  source: string;
  width: number;
  height: number;
  position?: string;
  fit?: 'cover' | 'contain';
  license?: { name: string; url: string };
};

const shareAlikeLicense = {
  name: 'CC BY-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-sa/4.0/',
};

export const servicePhotos: Record<ServicePhotoKey, ServicePhoto> = {
  corrimaos: {
    src: '/services/guarda-corpo.jpg',
    alt: 'Guarda-corpo em ferro com corrimão e desenhos curvos em varanda — referência',
    author: 'Wallace Chuck',
    source:
      'https://www.pexels.com/photo/black-metal-railings-in-the-balcony-13290888/',
    width: 1200,
    height: 1800,
    position: '50% 62%',
  },
  escadas: {
    src: '/services/escada-metalica.jpg',
    alt: 'Escada caracol de aço galvanizado com corrimão e guarda-corpo — referência',
    author: 'Trissi1234',
    source:
      'https://commons.wikimedia.org/wiki/File:Feuerverzinkte_Wendeltreppe.jpg',
    width: 960,
    height: 965,
    fit: 'contain',
    license: shareAlikeLicense,
  },
  portoes: {
    src: '/services/portao-residencial.jpg',
    alt: 'Portão residencial preto com duas folhas e barras verticais de metal — referência',
    author: 'The Drink Break',
    source:
      'https://unsplash.com/photos/a-gated-driveway-with-a-house-in-the-background-pTkARwGPMLg',
    width: 1600,
    height: 1067,
    position: '70% 100%',
  },
  grades: {
    src: '/services/grade-janela.jpg',
    alt: 'Grade branca de barras retas instalada em janela residencial — referência',
    author: 'Mike Scott',
    source: 'https://www.pexels.com/photo/a-window-with-metal-grills-6673302/',
    width: 1600,
    height: 1067,
  },
  estruturas: {
    src: '/services/estrutura-metalica.jpg',
    alt: 'Estrutura metálica de galpão em construção, com vigas, pilares e mezanino — referência',
    author: 'Syibeehive',
    source:
      'https://commons.wikimedia.org/wiki/File:Prefab-Warehouse-Mezzanine.jpg',
    width: 800,
    height: 600,
    fit: 'contain',
    license: shareAlikeLicense,
  },
  coberturas: {
    src: '/services/cobertura-metalica.jpg',
    alt: 'Cobertura de estacionamento com pilares e vigas de aço aparentes — referência',
    author: 'MAK',
    source:
      'https://unsplash.com/photos/cars-parked-under-a-modern-carport-on-a-sunny-day-3u5Lco_0gPQ',
    width: 1800,
    height: 1200,
    position: '30% 65%',
  },
};
