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
export const photoUrl = (key: string) =>
  `/api/fotos/${encodeURIComponent(key)}`;
export const instagramUrl = 'https://www.instagram.com/titaniumserralheria/';
export function quoteUrl(subject?: string) {
  return `https://wa.me/5511948507339?text=${encodeURIComponent(
    subject
      ? `Olá! Vi ${subject} no site da Titânio e gostaria de conversar sobre meu projeto e combinar uma avaliação no local.`
      : 'Olá! Vim pelo site da Titânio Serviços Integrados e gostaria de conversar sobre meu projeto e combinar uma avaliação no local.',
  )}`;
}
