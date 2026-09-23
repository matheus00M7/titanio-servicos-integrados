/* oxlint-disable nextjs/no-img-element -- Local licensed photos have explicit dimensions and loading priority. */
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Clock3,
  HardHat,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { MobileMenu, PortfolioGallery } from '@/components/portfolio-gallery';
import { instagramHandle, instagramUrl, quoteUrl } from '@/lib/portfolio';
import {
  weldingPhoto,
  servicePhotos,
  type ServicePhotoKey,
} from '@/lib/reference-photos';

const whatsappUrl = quoteUrl();
const trustPoints = [
  { icon: MapPin, text: 'Toda a Grande São Paulo' },
  { icon: ShieldCheck, text: 'Segurança em primeiro lugar' },
  { icon: Clock3, text: 'Compromisso com o prazo' },
];
const services: {
  photoKey: ServicePhotoKey;
  title: string;
  description: string;
}[] = [
  {
    photoKey: 'corrimaos',
    title: 'Corrimãos e guarda-corpos',
    description:
      'Apoio e proteção para escadas, rampas e varandas, com fabricação e instalação sob medida.',
  },
  {
    photoKey: 'escadas',
    title: 'Escadas metálicas',
    description:
      'Escadas para prédios, acessos de emergência e ligação entre pavimentos.',
  },
  {
    photoKey: 'portoes',
    title: 'Portões sob medida',
    description:
      'Portões de entrada e garagem em ferro, pensados para as medidas e o uso do imóvel.',
  },
  {
    photoKey: 'grades',
    title: 'Grades e fechamentos',
    description:
      'Grades para janelas, divisórias e fechamentos metálicos para residências e comércios.',
  },
  {
    photoKey: 'estruturas',
    title: 'Estruturas metálicas',
    description:
      'Estruturas para galpões, mezaninos e ampliações de áreas comerciais e industriais.',
  },
  {
    photoKey: 'coberturas',
    title: 'Coberturas metálicas',
    description:
      'Coberturas para garagens, corredores, quadras e áreas de convivência.',
  },
];
const integratedServices = [
  {
    title: 'Fachadas em ACM',
    description:
      'Revestimentos e acabamentos de fachadas para espaços comerciais e corporativos.',
  },
  {
    title: 'Alvenaria e concreto',
    description:
      'Etapas de construção e adequação que acompanham a execução do projeto.',
  },
  {
    title: 'Reformas e acabamentos',
    description:
      'Ajustes, pintura e finalização para entregar o espaço pronto para uso.',
  },
];
const processSteps = [
  {
    title: 'Converse pelo WhatsApp',
    description:
      'Conte o que precisa e em qual cidade fica o serviço. Se tiver fotos do local, pode enviar.',
  },
  {
    title: 'Combinamos a visita',
    description:
      'Avaliamos o espaço, tiramos as medidas e conversamos pessoalmente sobre materiais e acabamento.',
  },
  {
    title: 'Receba uma proposta sob medida',
    description:
      'Com os detalhes definidos, apresentamos o orçamento e combinamos o prazo antes de começar.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="site-header">
        <a
          className="brand-lockup"
          href="#inicio"
          aria-label="Titanium Serviços Integrados — início"
        >
          <span className="brand-mark">T</span>
          <span>
            <strong>TITANIUM</strong>
            <small>Serviços integrados</small>
          </span>
        </a>
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-8 lg:flex"
        >
          <a href="#servicos">Serviços</a>
          <a href="#trabalhos">Galeria</a>
          <a href="#processo">Como funciona</a>
          <a href="#contato">Atendimento</a>
        </nav>
        <a
          className="header-cta"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle aria-hidden="true" size={18} />
          <span className="hidden sm:inline">Falar com a equipe</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
        <MobileMenu />
      </header>

      <section id="inicio" className="hero-grid relative isolate pt-[76px]">
        <div className="hero-beam hero-beam-one" aria-hidden="true" />
        <div className="hero-beam hero-beam-two" aria-hidden="true" />
        <div className="hero-inner relative mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-12 lg:py-14 xl:px-16">
          <div className="relative z-10 max-w-[750px]">
            <p className="eyebrow">
              <span /> Sob medida • Grande São Paulo
            </p>
            <h1 className="hero-title mt-7">
              Corrimãos, escadas, portões basculantes, gradis e{' '}
              <span>estruturas metálicas.</span>
            </h1>
            <p className="mt-7 max-w-[640px] text-[1.05rem] leading-8 text-zinc-300 sm:text-lg">
              Fabricação e instalação para condomínios, empresas e residências.
              Seu projeto começa com uma conversa e uma avaliação no local.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="primary-cta"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Conversar no WhatsApp{' '}
                <ArrowDownRight aria-hidden="true" size={20} />
              </a>
              <a className="secondary-cta" href="#servicos">
                Conhecer os serviços
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-zinc-400">
              <span className="flex items-center gap-2">
                <MessageCircle
                  aria-hidden="true"
                  className="text-gold"
                  size={17}
                />{' '}
                Orçamento após avaliação
              </span>
              <a
                className="flex items-center gap-2 transition-colors hover:text-white"
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <AtSign aria-hidden="true" className="text-gold" size={17} />{' '}
                @{instagramHandle}
              </a>
            </div>
          </div>
          <figure className="hero-workshop">
            <img
              className="hero-workshop-photo"
              src={weldingPhoto.src}
              alt={weldingPhoto.alt}
              width={weldingPhoto.width}
              height={weldingPhoto.height}
              fetchPriority="high"
            />
            <figcaption>
              <span>Soldagem • foto de referência</span>
              <a href={weldingPhoto.source} target="_blank" rel="noreferrer">
                {weldingPhoto.author} / {weldingPhoto.provider}
              </a>
            </figcaption>
            <p className="photo-context">
              Fotografia de banco de imagens; não retrata a equipe da Titanium.
            </p>
          </figure>
          <div className="trust-rail lg:col-span-2">
            {trustPoints.map(({ icon: Icon, text }, index) => (
              <div className="trust-item" key={text}>
                <span className="trust-number">0{index + 1}</span>
                <Icon aria-hidden="true" size={21} />
                <span>{text}</span>
              </div>
            ))}
            <a href="tel:+5511948507339" className="trust-phone">
              <small>Fale com a gente</small>
              <strong>11 94850-7339</strong>
            </a>
          </div>
        </div>
      </section>

      <section
        id="servicos"
        className="content-section services-section scroll-mt-20"
      >
        <div className="section-shell">
          <div className="section-heading-grid">
            <p className="section-index">
              <span>01</span> Nossos serviços
            </p>
            <div>
              <h2 className="section-title">
                Uma solução em metal
                <br />
                para cada espaço.
              </h2>
              <p className="section-copy">
                Conheça os tipos de serviço e converse com a equipe sobre o seu
                projeto.
              </p>
            </div>
          </div>
          <p className="service-reference-note">
            Fotos de trabalhos reais da Titanium. Na categoria de estruturas
            metálicas, mantivemos a referência visual selecionada.
          </p>
          <div className="service-photo-grid">
            {services.map(({ photoKey, title, description }, index) => {
              const photo = servicePhotos[photoKey];
              return (
                <article
                  id={index === 0 ? 'especialidade' : undefined}
                  className="photo-service-card"
                  key={title}
                >
                  <figure className="photo-service-image">
                    <div className="photo-service-frame">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        style={{
                          objectPosition: photo.position || 'center',
                          objectFit: photo.fit || 'cover',
                        }}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </figure>
                  <div className="photo-service-body">
                    <p className="photo-service-kicker">
                      Serralheria sob medida
                    </p>
                    <h3>{title}</h3>
                    <p className="photo-service-summary">{description}</p>
                    <a
                      className="photo-service-contact"
                      href={quoteUrl(`o serviço de ${title.toLowerCase()}`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Falar sobre este serviço{' '}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="integrated-services">
            <div className="integrated-services-heading">
              <HardHat aria-hidden="true" size={24} />
              <div>
                <p className="photo-service-kicker">Serviços integrados</p>
                <h3>Também cuidamos de outras etapas da obra.</h3>
              </div>
            </div>
            <div className="integrated-services-grid">
              {integratedServices.map(({ title, description }, index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </article>
              ))}
            </div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              Conversar sobre sua obra{' '}
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          </div>
        </div>
      </section>

      <PortfolioGallery />

      <section
        id="processo"
        className="content-section process-section scroll-mt-20"
      >
        <div className="section-shell process-grid">
          <div>
            <p className="section-index">
              <span>03</span> Como funciona
            </p>
            <h2 className="section-title max-w-[720px]">
              Primeiro, a gente
              <br />
              entende sua obra.
            </h2>
            <div className="process-list">
              {processSteps.map(({ title, description }, index) => (
                <article className="process-step" key={title}>
                  <span className="process-step-number">0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <ArrowDownRight aria-hidden="true" size={24} />
                </article>
              ))}
            </div>
          </div>
          <aside className="contact-panel">
            <div className="contact-panel-icon">
              <MessageCircle aria-hidden="true" size={29} />
            </div>
            <p className="contact-panel-label">Atendimento direto</p>
            <h3>
              Cada obra tem
              <br />
              suas medidas.
            </h3>
            <p>
              O orçamento depende do local, dos materiais e do que precisa ser
              feito. Chame no WhatsApp para conversar e combinar uma avaliação.
            </p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              Falar sobre meu projeto <Send aria-hidden="true" size={18} />
            </a>
            <div className="contact-panel-meta">
              <span>
                <Phone aria-hidden="true" size={16} /> 11 94850-7339
              </span>
              <span>
                <MapPin aria-hidden="true" size={16} /> Grande São Paulo
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section id="contato" className="final-cta scroll-mt-20">
        <div className="section-shell final-cta-inner">
          <div className="final-cta-location">
            <MapPin aria-hidden="true" size={22} />
            <span>Atendimento em toda a Grande São Paulo</span>
          </div>
          <h2>
            Vamos conversar <span>sobre sua obra?</span>
          </h2>
          <p>Fale direto com a Titanium e combine os próximos passos.</p>
          <div className="final-cta-actions">
            <a
              className="final-cta-primary"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" size={21} /> Chamar no WhatsApp{' '}
              <ArrowUpRight aria-hidden="true" size={20} />
            </a>
            <a className="final-cta-secondary" href="tel:+5511948507339">
              <Phone aria-hidden="true" size={20} />
              11 94850-7339
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-shell footer-inner">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">
              T
            </span>
            <span>
              <strong>TITANIUM</strong>
              <small>Serviços integrados</small>
            </span>
          </div>
          <div className="footer-links">
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              <AtSign aria-hidden="true" size={17} /> @{instagramHandle}
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" size={17} /> WhatsApp
            </a>
          </div>
          <p className="footer-business">
            Razão social: TITANIUM SOLUCOES E SERVICOS INTEGRADOS LTDA · CNPJ
            67.884.255/0001-35 · São Paulo/SP
          </p>
          <details className="image-credits">
            <summary>Créditos de imagem</summary>
            <p>
              Imagem ilustrativa de estruturas metálicas:{' '}
              <a
                href="https://commons.wikimedia.org/wiki/File:Prefab-Warehouse-Mezzanine.jpg"
                target="_blank"
                rel="noreferrer"
              >
                Syibeehive
              </a>{' '}
              — CC BY-SA 4.0.
            </p>
          </details>
        </div>
      </footer>
      <a
        className="floating-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Conversar com a Titanium no WhatsApp"
      >
        <MessageCircle aria-hidden="true" size={24} />
        <span>Fale com a gente</span>
      </a>
    </main>
  );
}
