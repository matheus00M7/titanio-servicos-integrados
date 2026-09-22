/* oxlint-disable nextjs/no-html-link-for-pages -- Authentication navigation must reach the Sites dispatch in the top-level document. */
import { getChatGPTUser, chatGPTSignInPath } from '@/app/chatgpt-auth';
import { isAdmin } from '@/lib/portfolio-server';
import { PortfolioManager } from '@/components/portfolio-manager';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Painel de trabalhos | Titanium Serviços Integrados',
  robots: { index: false, follow: false },
};
export default async function PanelPage() {
  const user = await getChatGPTUser();
  if (!user || !(await isAdmin()))
    return (
      <main className="panel-access">
        <p className="eyebrow">Titanium • Área de gestão</p>
        <h1>
          Seu portfólio,
          <br />
          sempre atualizado.
        </h1>
        <p>
          Entre com a conta autorizada para cadastrar fotos e gerenciar os
          trabalhos que aparecem no site.
        </p>
        {user ? (
          <>
            <p role="alert">Esta conta não tem acesso ao painel.</p>
            <a
              className="primary-cta"
              href="/signout-with-chatgpt?return_to=%2Fpainel"
              target="_top"
            >
              Trocar de conta
            </a>
          </>
        ) : (
          <a
            className="primary-cta"
            href={chatGPTSignInPath('/painel')}
            target="_top"
          >
            Entrar com ChatGPT
          </a>
        )}
        <a className="panel-back" href="/">
          Voltar ao site
        </a>
      </main>
    );
  return <PortfolioManager />;
}
