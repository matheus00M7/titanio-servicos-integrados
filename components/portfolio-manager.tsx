'use client';
/* oxlint-disable nextjs/no-img-element -- Direct URLs preserve authorization for draft photos and support local blob previews. */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SubmitEvent as ReactSubmitEvent,
} from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import {
  categories,
  photoUrl,
  type Category,
  type Project,
} from '@/lib/portfolio';
import { ProjectViewer } from '@/components/portfolio-gallery';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

type NewPhoto = { id: string; file: File; url: string };

async function preparePhoto(file: File): Promise<File> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    throw new Error(
      'Escolha imagens JPG, PNG ou WebP. Para HEIC, exporte a foto como JPG.',
    );
  if (file.size > 20 * 1024 * 1024)
    throw new Error('Uma foto passou de 20 MB. Escolha uma versão menor.');
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context)
      throw new Error(
        'Não foi possível preparar esta foto. Tente outro navegador.',
      );
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) =>
          value
            ? resolve(value)
            : reject(new Error('Não foi possível preparar a imagem.')),
        'image/jpeg',
        0.86,
      ),
    );
    if (blob.size > 4 * 1024 * 1024)
      throw new Error(
        'Esta imagem continua grande demais. Escolha outra versão.',
      );
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, {
      type: 'image/jpeg',
    });
  } finally {
    bitmap.close();
  }
}

export function PortfolioManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('todos');
  const [editor, setEditor] = useState<Project | 'new' | null>(null);
  const [view, setView] = useState<Project | null>(null);
  const [busyId, setBusyId] = useState('');
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/trabalhos?painel=1', {
        cache: 'no-store',
      });
      const data = (await response.json()) as {
        projects: Project[];
        error?: string;
      };
      if (!response.ok)
        throw new Error(
          data.error || 'Não foi possível carregar seus trabalhos.',
        );
      setProjects(data.projects);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar seus trabalhos.',
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    // oxlint-disable-next-line react/react-compiler -- State updates happen after the network request settles; this effect only starts the initial load.
    void refresh();
  }, [refresh]);
  function reload() {
    setLoading(true);
    setError('');
    void refresh();
  }

  async function toggle(project: Project) {
    setBusyId(project.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/trabalhos/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published: !project.published,
          updated_at: project.updated_at,
        }),
      });
      const data = (await response.json()) as {
        project: Project;
        error?: string;
      };
      if (!response.ok)
        throw new Error(data.error || 'Não foi possível atualizar.');
      setProjects((all) =>
        all.map((p) => (p.id === project.id ? data.project : p)),
      );
      setNotice(
        project.published
          ? 'Trabalho ocultado. As fotos continuam salvas e você pode publicá-lo novamente.'
          : 'Trabalho publicado. Ele já aparece na galeria do site.',
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Não foi possível atualizar.',
      );
    } finally {
      setBusyId('');
    }
  }
  const published = projects.filter((project) => project.published).length;
  return (
    <main className="manager-page">
      <header className="manager-header">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark">T</span>
          <span>
            <strong>TITANIUM</strong>
            <small>Painel de trabalhos</small>
          </span>
        </Link>
        <a href="/" target="_blank" rel="noreferrer">
          Ver site <ArrowUpRight size={18} />
        </a>
      </header>
      <div className="manager-shell">
        <div className="manager-heading">
          <div>
            <p className="eyebrow">Seu trabalho em destaque</p>
            <h1>Meu portfólio</h1>
            <p>
              Cadastre fotos, conte o que foi feito e escolha o que aparece para
              seus clientes.
            </p>
          </div>
          <Button
            className="manager-primary"
            onClick={() => {
              setNotice('');
              setEditor('new');
            }}
          >
            <Plus size={20} /> Novo trabalho
          </Button>
        </div>
        <div className="manager-summary">
          <span>
            <b>{published}</b> no site
          </span>
          <span>
            <b>{projects.length - published}</b> rascunhos / ocultos
          </span>
          <p>
            <Check size={17} /> As fotos ficam salvas para você acessar de
            qualquer dispositivo.
          </p>
        </div>
        {notice && (
          <output className="manager-notice">
            <Check size={19} />
            {notice}
          </output>
        )}
        {error && (
          <div className="manager-error" role="alert">
            <p>{error}</p>
            <Button variant="outline" onClick={reload}>
              Atualizar lista
            </Button>
          </div>
        )}
        {loading ? (
          <div
            className="manager-grid"
            aria-busy="true"
            aria-label="Carregando trabalhos"
          >
            {[0, 1, 2].map((n) => (
              <Skeleton key={n} className="manager-loading" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          !error && (
            <Empty className="manager-empty">
              <ImagePlus size={42} />
              <EmptyHeader>
                <EmptyTitle className="empty-heading">
                  Vamos cadastrar o primeiro trabalho?
                </EmptyTitle>
                <EmptyDescription>
                  Escolha até 6 fotos da obra, adicione um título e publique. A
                  primeira foto será a capa na galeria.
                </EmptyDescription>
              </EmptyHeader>
              <Button
                className="manager-primary"
                onClick={() => setEditor('new')}
              >
                <Plus /> Cadastrar trabalho
              </Button>
            </Empty>
          )
        ) : (
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(String(value))}
          >
            <TabsList
              className="gallery-filters"
              aria-label="Filtrar trabalhos no painel"
            >
              <TabsTrigger value="todos">Todos ({projects.length})</TabsTrigger>
              <TabsTrigger value="publicados">
                No site ({published})
              </TabsTrigger>
              <TabsTrigger value="rascunhos">
                Rascunhos / ocultos ({projects.length - published})
              </TabsTrigger>
            </TabsList>
            {['todos', 'publicados', 'rascunhos'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="manager-grid">
                  {projects
                    .filter(
                      (p) =>
                        tab === 'todos' ||
                        (tab === 'publicados' ? p.published : !p.published),
                    )
                    .map((project) => (
                      <article className="manager-card" key={project.id}>
                        <button
                          className="manager-photo"
                          onClick={() => setView(project)}
                          aria-label={`Ver fotos de ${project.title}`}
                        >
                          <img
                            src={photoUrl(project.images[0])}
                            alt={project.title}
                            width={800}
                            height={600}
                            loading="lazy"
                          />
                          <span
                            className={`project-status ${project.published ? 'published' : ''}`}
                          >
                            {project.published
                              ? 'No site'
                              : 'Rascunho / oculto'}
                          </span>
                          <span className="photo-count">
                            <Camera size={15} />
                            {project.images.length}
                          </span>
                        </button>
                        <div className="manager-card-body">
                          <p className="gallery-category">{project.category}</p>
                          <h2>{project.title}</h2>
                          <p>
                            {project.location || 'Localização não informada'}
                          </p>
                          <div className="manager-card-actions">
                            <Button
                              variant="outline"
                              disabled={busyId === project.id}
                              onClick={() => setEditor(project)}
                            >
                              <Pencil size={17} />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              disabled={!!busyId}
                              onClick={() => void toggle(project)}
                            >
                              {busyId === project.id ? (
                                <LoaderCircle className="animate-spin" />
                              ) : project.published ? (
                                <EyeOff />
                              ) : (
                                <Eye />
                              )}
                              {project.published ? 'Ocultar' : 'Publicar'}
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
                {projects.filter(
                  (p) =>
                    tab === 'todos' ||
                    (tab === 'publicados' ? p.published : !p.published),
                ).length === 0 && (
                  <Empty>
                    <EmptyTitle>Nenhum trabalho nesta seção.</EmptyTitle>
                  </Empty>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
        <div className="manager-tip">
          <Camera size={24} />
          <div>
            <h2>Uma boa foto faz diferença.</h2>
            <p>
              Mostre a obra completa e os detalhes do acabamento. Prefira boa
              iluminação e evite placas, rostos ou endereços que não precisam
              aparecer.
            </p>
          </div>
        </div>
      </div>
      {editor && (
        <ProjectEditor
          project={editor === 'new' ? null : editor}
          onClose={() => setEditor(null)}
          onSaved={(project) => {
            setProjects((all) => [
              project,
              ...all.filter((p) => p.id !== project.id),
            ]);
            setEditor(null);
            setNotice(
              project.published
                ? 'Trabalho publicado. As fotos já estão na galeria do site.'
                : 'Rascunho salvo. Só você vê este trabalho no painel.',
            );
          }}
        />
      )}
      <ProjectViewer
        project={view}
        open={!!view}
        onClose={() => setView(null)}
      />
    </main>
  );
}

function ProjectEditor({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: (project: Project) => void;
}) {
  const [retained, setRetained] = useState(project?.images || []);
  const [photos, setPhotos] = useState<NewPhoto[]>([]);
  const [title, setTitle] = useState(project?.title || '');
  const [category, setCategory] = useState<Category>(
    project?.category || categories[0],
  );
  const [description, setDescription] = useState(project?.description || '');
  const [location, setLocation] = useState(project?.location || '');
  const [error, setError] = useState('');
  const [preparing, setPreparing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const objectUrls = useRef(new Set<string>());
  const total = retained.length + photos.length;
  const locked = preparing || saving;
  const dirty =
    title !== (project?.title || '') ||
    category !== (project?.category || categories[0]) ||
    description !== (project?.description || '') ||
    location !== (project?.location || '') ||
    photos.length > 0 ||
    JSON.stringify(retained) !== JSON.stringify(project?.images || []);
  function requestClose() {
    if (!locked) {
      if (dirty) setConfirmDiscard(true);
      else onClose();
    }
  }
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  async function addPhotos(files: File[]) {
    if (locked || !files.length) return;
    if (total + files.length > 6) {
      setError(
        'Cada trabalho pode ter até 6 fotos. Remova uma foto para adicionar outra.',
      );
      return;
    }
    setPreparing(true);
    setError('');
    const prepared: NewPhoto[] = [];
    try {
      for (const original of files) {
        const file = await preparePhoto(original);
        const url = URL.createObjectURL(file);
        objectUrls.current.add(url);
        prepared.push({ file, url, id: crypto.randomUUID() });
      }
      setPhotos((all) => [...all, ...prepared]);
    } catch (err) {
      prepared.forEach(({ url }) => {
        URL.revokeObjectURL(url);
        objectUrls.current.delete(url);
      });
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível preparar as fotos.',
      );
    } finally {
      setPreparing(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }
  async function submit(event: ReactSubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;
    if (total < 1) {
      setError('Adicione pelo menos uma foto para salvar o trabalho.');
      return;
    }
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const publish =
      submitter?.value === 'draft'
        ? false
        : submitter?.value === 'publish'
          ? true
          : (project?.published ?? false);
    setSaving(true);
    setError('');
    try {
      const body = new FormData();
      body.set('title', title);
      body.set('category', category);
      body.set('description', description);
      body.set('location', location);
      body.set('published', String(publish));
      body.set('retained', JSON.stringify(retained));
      body.set('updated_at', project?.updated_at || '');
      photos.forEach(({ file }) => body.append('photos', file));
      const response = await fetch(
        project ? `/api/trabalhos/${project.id}` : '/api/trabalhos',
        { method: project ? 'PUT' : 'POST', body },
      );
      const data = (await response.json()) as {
        project: Project;
        error?: string;
      };
      if (!response.ok)
        throw new Error(data.error || 'Não foi possível salvar.');
      onSaved(data.project);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Falha de conexão. Tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  }
  const cover = retained[0] ? photoUrl(retained[0]) : photos[0]?.url;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) requestClose();
      }}
    >
      <DialogContent className="project-editor" showCloseButton={false}>
        <DialogClose
          className="viewer-close"
          disabled={locked}
          aria-label="Fechar cadastro"
        >
          <X size={23} />
        </DialogClose>
        <DialogTitle className="editor-title">
          {project ? 'Editar trabalho' : 'Novo trabalho'}
        </DialogTitle>
        <DialogDescription className="editor-description">
          Adicione as fotos e os detalhes. Você decide quando o trabalho aparece
          no site.
        </DialogDescription>
        <form onSubmit={submit} className="editor-form">
          <div className="editor-main">
            <fieldset disabled={locked}>
              <legend>
                1. Fotos do trabalho <span>{total}/6</span>
              </legend>
              <div
                className={`photo-dropzone ${dragging ? 'dragging' : ''}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (!locked) setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  void addPhotos(Array.from(event.dataTransfer.files));
                }}
              >
                <Upload size={26} aria-hidden="true" />
                <strong>
                  {preparing ? 'Preparando as fotos…' : 'Arraste as fotos aqui'}
                </strong>
                <span>ou escolha na galeria do seu celular</span>
                <Button
                  type="button"
                  variant="outline"
                  disabled={locked || total === 6}
                  onClick={() => fileInput.current?.click()}
                >
                  {preparing ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <ImagePlus />
                  )}
                  Selecionar fotos
                </Button>
                <input
                  ref={fileInput}
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={locked}
                  aria-label="Selecionar fotos do trabalho"
                  onChange={(event) =>
                    void addPhotos(Array.from(event.target.files || []))
                  }
                />
                <small>
                  JPG, PNG ou WebP • até 6 fotos • a primeira será a capa
                </small>
              </div>
              {total > 0 && (
                <div className="photo-previews">
                  {retained.map((key, index) => (
                    <div key={key}>
                      <img
                        src={photoUrl(key)}
                        alt={`Foto atual ${index + 1}`}
                      />
                      {index === 0 && <span>Capa</span>}
                      <button
                        type="button"
                        onClick={() =>
                          setRetained((all) =>
                            all.filter((item) => item !== key),
                          )
                        }
                        aria-label={`Remover foto ${index + 1}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {photos.map((photo, index) => (
                    <div key={photo.id}>
                      <img src={photo.url} alt={`Nova foto ${index + 1}`} />
                      {retained.length === 0 && index === 0 && (
                        <span>Capa</span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setPhotos((all) =>
                            all.filter((p) => p.id !== photo.id),
                          );
                          URL.revokeObjectURL(photo.url);
                          objectUrls.current.delete(photo.url);
                        }}
                        aria-label={`Remover nova foto ${index + 1}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </fieldset>
            <fieldset disabled={locked} className="editor-fields">
              <legend>2. Detalhes do trabalho</legend>
              <label htmlFor="work-title">
                Título <span>obrigatório</span>
              </label>
              <Input
                id="work-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex.: Corrimão para escada de condomínio"
                required
                minLength={3}
                maxLength={90}
              />
              <label htmlFor="work-category">Tipo de serviço</label>
              <NativeSelect
                id="work-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as Category)
                }
              >
                {categories.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {value}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <label htmlFor="work-location">
                Cidade ou bairro <span>opcional</span>
              </label>
              <Input
                id="work-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Ex.: São Bernardo do Campo — SP"
                maxLength={80}
              />
              <label htmlFor="work-description">
                O que foi feito? <span>opcional</span>
              </label>
              <Textarea
                id="work-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Conte um pouco sobre o serviço e o acabamento."
                maxLength={700}
                rows={4}
              />
            </fieldset>
          </div>
          <aside className="editor-preview">
            <p>Assim aparece na galeria</p>
            <div className="work-card">
              {cover ? (
                <img
                  className="editor-cover"
                  src={cover}
                  alt="Prévia da capa do trabalho"
                />
              ) : (
                <div className="editor-cover-empty">
                  <Camera size={34} />
                  <span>Adicione a primeira foto</span>
                </div>
              )}
              <div className="work-details">
                <p className="gallery-category">{category}</p>
                <h3>{title || 'Título do seu trabalho'}</h3>
                {location && <p className="gallery-location">{location}</p>}
                <span className="preview-link">
                  Quero um projeto assim <ArrowUpRight size={17} />
                </span>
              </div>
            </div>
            <p className="preview-help">
              As fotos são preparadas automaticamente para carregar mais rápido
              no site.
            </p>
          </aside>
          <div className="editor-bottom">
            {error && (
              <p role="alert" className="editor-error">
                {error}
              </p>
            )}
            <p className="save-progress" aria-live="polite">
              {saving
                ? 'Enviando fotos e salvando o trabalho…'
                : preparing
                  ? 'Preparando imagens…'
                  : 'Rascunhos ficam visíveis apenas no painel.'}
            </p>
            <div>
              <Button
                type="submit"
                name="action"
                value="publish"
                className="manager-primary"
                disabled={locked}
              >
                {saving ? <LoaderCircle className="animate-spin" /> : <Check />}
                {project?.published ? 'Salvar alterações' : 'Publicar trabalho'}
              </Button>
              <Button
                type="submit"
                name="action"
                value="draft"
                variant="outline"
                disabled={locked}
              >
                Salvar rascunho
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={locked}
                onClick={requestClose}
              >
                <ArrowLeft size={17} />
                Voltar
              </Button>
            </div>
          </div>
        </form>
        <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
          <AlertDialogContent className="discard-confirmation">
            <AlertDialogTitle>Descartar as alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              As fotos e os detalhes que você ainda não salvou serão
              descartados. O trabalho salvo anteriormente não será alterado.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Continuar editando</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onClose}>
                Descartar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
