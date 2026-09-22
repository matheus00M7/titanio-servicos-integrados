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

const attributionLicense = {
  name: 'CC BY 2.0',
  url: 'https://creativecommons.org/licenses/by/2.0/',
};

const publicDomainLicense = {
  name: 'Domínio público',
  url: 'https://creativecommons.org/publicdomain/mark/1.0/',
};

export const servicePhotos: Record<ServicePhotoKey, ServicePhoto> = {
  corrimaos: {
    src: '/services/corrimao-brasil.jpg',
    alt: 'Corrimãos tubulares em rampas de acesso de uma escola brasileira — foto de referência',
    author: 'Nadjelena',
    source:
      'https://commons.wikimedia.org/wiki/File:Pr%C3%A9dio_do_IEMA_Bacelar_Portela.jpg',
    width: 1280,
    height: 338,
    position: '50% center',
    license: shareAlikeLicense,
  },
  escadas: {
    src: '/services/escada-emergencia-brasil.jpg',
    alt: 'Escada metálica externa de emergência instalada em prédio de Curitiba — foto de referência',
    author: 'Luis Dantas',
    source:
      'https://commons.wikimedia.org/wiki/File:Escadas_de_incendio_TRT_Curitiba_01.jpg',
    width: 960,
    height: 1280,
    position: '50% 48%',
    license: publicDomainLicense,
  },
  portoes: {
    src: '/services/portao-ferro-brasil.jpg',
    alt: 'Portão de ferro trabalhado fotografado em São Paulo — foto de referência',
    author: 'Blond Fox',
    source:
      'https://www.pexels.com/photo/ornate-iron-gate-in-sao-paulo-brazil-34856770/',
    width: 1400,
    height: 2100,
    position: '50% 53%',
  },
  grades: {
    src: '/services/grade-janela-brasil.jpg',
    alt: 'Grade preta de barras retas instalada em janela residencial de Maceió — foto de referência',
    author: 'Giovanni lucas ft',
    source:
      'https://www.pexels.com/photo/a-dog-sitting-behind-a-barred-window-20195822/',
    width: 1200,
    height: 1600,
    position: '50% 36%',
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
    src: '/services/cobertura-quadra-brasil.jpg',
    alt: 'Cobertura metálica com treliças aparentes em quadra esportiva na Bahia — foto de referência',
    author: 'Jaques Wagner Governador',
    source:
      'https://commons.wikimedia.org/wiki/File:Gin%C3%A1sio_de_Esporte_de_Ubat%C3%A3_%C3%A9_reinaugurado_(3684447515).jpg',
    width: 1280,
    height: 854,
    position: '50% 20%',
    license: attributionLicense,
  },
};
