# Titânio Serviços Integrados

Site institucional e portfólio para uma empresa de serralheria e serviços de obra na Grande São Paulo.

## O que está incluído

- página institucional responsiva em português do Brasil;
- contatos por WhatsApp e Instagram;
- seis categorias de serviços com fotografias de referência identificadas;
- galeria pública de trabalhos com filtros e visualizador de fotos;
- painel protegido em `/painel` para cadastrar, editar, publicar e ocultar trabalhos;
- D1 para os dados do portfólio e R2 para as fotos enviadas;
- autenticação fornecida pelo ChatGPT Sites;
- migração inicial do banco e teste de integração local.

## Tecnologias

- React 19 e Vinext;
- TypeScript e Tailwind CSS;
- Cloudflare Workers, D1 e R2;
- Drizzle ORM;
- componentes Shadcn/Base UI.

## Uso local

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Para testar o fluxo completo do painel com D1 e R2 locais, consulte [`tests/README.md`](tests/README.md).

## Publicação em outra conta do ChatGPT Sites

Este repositório foi preparado para migração e não contém o identificador do Site anterior. Ao publicar pela primeira vez em outra conta, reutilize os vínculos lógicos definidos em `.openai/hosting.json`:

- banco D1: `DB`;
- armazenamento R2: `PHOTOS`.

Configure `ADMIN_EMAILS` nas configurações hospedadas com o e-mail autorizado a acessar `/painel`. Não grave e-mails reais, tokens ou segredos no repositório.

Dados e fotos cadastrados no Site anterior não fazem parte deste código. Se existirem trabalhos reais no banco anterior, eles precisam ser migrados separadamente.

## Imagens e marca

As fotografias de referência não representam funcionários nem obras da Titânio. Autores, origens e licenças estão documentados em [`IMAGE-NOTES.md`](IMAGE-NOTES.md). O logotipo pertence à empresa e não é oferecido como ativo reutilizável por terceiros.

## Próxima melhoria

Substituir as referências visuais que parecem estrangeiras por fotografias reais e licenciadas, preferencialmente brasileiras ou compatíveis com construções da Grande São Paulo, sem apresentá-las como trabalhos executados pela empresa.
