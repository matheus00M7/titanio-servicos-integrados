'use client';
/* oxlint-disable nextjs/no-img-element -- Private R2 photos must use their authenticated, uncached URL; uploads are resized before storage. */

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Menu,
  MessageCircle,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  categories,
  featuredProjects,
  instagramUrl,
  photoUrl,
  quoteUrl,
  type Project,
} from '@/lib/portfolio';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-menu">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="mobile-menu-trigger" aria-label="Abrir menu">
          <Menu size={24} />
        </SheetTrigger>
        <SheetContent className="navigation-sheet" showCloseButton={false}>
          <SheetTitle>TITÂNIO</SheetTitle>
          <SheetDescription>
            Serviços integrados • Grande São Paulo
          </SheetDescription>
          <SheetClose className="sheet-close" aria-label="Fechar menu">
            <X />
          </SheetClose>
          <nav aria-label="Menu do celular">
            {[
              ['#trabalhos', 'Galeria'],
              ['#servicos', 'Serviços'],
              ['#especialidade', 'Escadas e corrimãos'],
              ['#processo', 'Como pedir orçamento'],
              ['#contato', 'Contato'],
            ].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
                <ArrowUpRight size={19} />
              </a>
            ))}
          </nav>
          <a
            className="primary-cta"
            href={quoteUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={19} /> Conversar no WhatsApp
          </a>
        </SheetContent>
      </Sheet>
    </div>
  );
}

type ViewerProps = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
};
export function ProjectViewer(props: ViewerProps) {
  return (
    <ProjectViewerContent key={props.project?.id || 'closed'} {...props} />
  );
}
function ProjectViewerContent({ project, open, onClose }: ViewerProps) {
  const [index, setIndex] = useState(0);
  return (
    <Dialog
      open={open && !!project}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="project-viewer" showCloseButton={false}>
        {project && (
          <>
            <DialogClose className="viewer-close" aria-label="Fechar fotos">
              <X size={22} />
            </DialogClose>
            <div className="viewer-image-wrap">
              <img
                src={photoUrl(project.images[index] || project.images[0])}
                alt={`${project.title} — foto ${index + 1}`}
                className="viewer-image"
              />
              {project.images.length > 1 && (
                <div className="viewer-controls">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setIndex(
                        (i) =>
                          (i - 1 + project.images.length) %
                          project.images.length,
                      )
                    }
                    aria-label="Foto anterior"
                  >
                    <ArrowLeft />
                  </Button>
                  <span aria-live="polite">
                    {index + 1} / {project.images.length}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setIndex((i) => (i + 1) % project.images.length)
                    }
                    aria-label="Próxima foto"
                  >
                    <ArrowRight />
                  </Button>
                </div>
              )}
            </div>
            <div className="viewer-details">
              <p className="gallery-category">{project.category}</p>
              <DialogTitle className="viewer-title">
                {project.title}
              </DialogTitle>
              <DialogDescription className="viewer-description">
                {project.description ||
                  'Conheça os detalhes deste trabalho da Titânio.'}
              </DialogDescription>
              {project.location && (
                <p className="gallery-location">
                  <MapPin size={16} />
                  {project.location}
                </p>
              )}
              <a
                className="primary-cta"
                href={quoteUrl(`o trabalho “${project.title}”`)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={19} /> Quero um projeto assim
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function PortfolioGallery() {
  const [projects, setProjects] = useState<Project[]>(featuredProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [selected, setSelected] = useState<Project | null>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/trabalhos', { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Falha');
        return response.json();
      })
      .then((data) => {
        const managed = (data as { projects: Project[] }).projects;
        setProjects([
          ...featuredProjects,
          ...managed.filter(
            (project) =>
              !featuredProjects.some((featured) => featured.id === project.id),
          ),
        ]);
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && featuredProjects.length === 0)
          setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retry]);
  const available = [
    'Todos',
    ...categories.filter((category) =>
      projects.some((p) => p.category === category),
    ),
  ];
  if (!loading && !error && projects.length === 0) {
    return (
      <section
        id="trabalhos"
        className="gallery-section gallery-instagram-only"
      >
        <div className="section-shell instagram-work-strip">
          <div>
            <p className="eyebrow">
              <span /> Trabalhos da Titânio
            </p>
            <h2>Veja nossas obras no Instagram.</h2>
            <p>
              Acompanhe os serviços e os detalhes do nosso trabalho no perfil da
              empresa.
            </p>
          </div>
          <a
            className="secondary-cta"
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ver trabalhos no Instagram{' '}
            <ArrowUpRight aria-hidden="true" size={20} />
          </a>
        </div>
      </section>
    );
  }
  return (
    <section id="trabalhos" className="gallery-section">
      <div className="section-shell">
        <div className="gallery-heading">
          <div>
            <p className="eyebrow">
              <span /> Feito pela Titânio
            </p>
            <h2 className="section-title">Nossos trabalhos, de perto.</h2>
          </div>
          <div>
            <p>Veja os serviços realizados e os detalhes do acabamento.</p>
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              Trabalhos da Titânio no Instagram <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        {loading ? (
          <div
            className="gallery-grid"
            aria-label="Carregando trabalhos"
            aria-busy="true"
          >
            {[0, 1, 2].map((n) => (
              <Skeleton className="gallery-loading" key={n} />
            ))}
          </div>
        ) : error ? (
          <Empty className="gallery-empty">
            <EmptyHeader>
              <EmptyTitle>As fotos não carregaram agora.</EmptyTitle>
              <EmptyDescription>
                Tente novamente ou veja os trabalhos no Instagram.
              </EmptyDescription>
            </EmptyHeader>
            <Button
              onClick={() => {
                setLoading(projects.length === 0);
                setError(false);
                setRetry((n) => n + 1);
              }}
            >
              Tentar novamente
            </Button>
          </Empty>
        ) : (
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(String(value))}
          >
            <TabsList
              className="gallery-filters"
              aria-label="Filtrar trabalhos por serviço"
            >
              {available.map((category) => (
                <TabsTrigger value={category} key={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {available.map((category) => (
              <TabsContent value={category} key={category}>
                <div className="gallery-grid">
                  {projects
                    .filter(
                      (p) => category === 'Todos' || p.category === category,
                    )
                    .map((project) => (
                      <article className="work-card" key={project.id}>
                        <button
                          className="work-photo"
                          onClick={() => setSelected(project)}
                          aria-label={`Ampliar fotos: ${project.title}`}
                        >
                          <img
                            src={photoUrl(project.images[0])}
                            alt={project.title}
                            loading="lazy"
                            width={800}
                            height={600}
                          />
                          <span className="work-zoom">
                            <ZoomIn size={20} /> Ver{' '}
                            {project.images.length > 1
                              ? `${project.images.length} fotos`
                              : 'foto'}
                          </span>
                        </button>
                        <div className="work-details">
                          <p className="gallery-category">{project.category}</p>
                          <h3>
                            <button onClick={() => setSelected(project)}>
                              {project.title}
                            </button>
                          </h3>
                          {project.location && (
                            <p className="gallery-location">
                              <MapPin size={15} /> {project.location}
                            </p>
                          )}
                          <a
                            href={quoteUrl(`o trabalho “${project.title}”`)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Quero um projeto assim <ArrowUpRight size={18} />
                          </a>
                        </div>
                      </article>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
      <ProjectViewer
        project={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
