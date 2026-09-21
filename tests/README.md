# Verificação local do portfólio

O teste não acessa produção. Ele usa o Worker compilado em `http://127.0.0.1:8787`, com D1 e R2 locais.

1. Execute `npm run build`.
2. Em uma base local nova, aplique a migração com `npx wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/test-state --file drizzle/0000_gray_wallow.sql`.
3. Execute `npm run start -- --port 8787 --var ADMIN_EMAILS:seedy@sites.test --persist-to .wrangler/test-state`.
4. Execute `node tests/portfolio.integration.mjs`.

O teste simula os cabeçalhos de identidade apenas no Worker local, sem Sites dispatch. Em produção, o Sites é responsável por autenticar e fornecer esses cabeçalhos. Os registros de teste são mantidos somente como rascunhos na base local.

Inclui envio e leitura dos bytes de uma imagem, permissão de administrador, bloqueio de origem diferente, isolamento de rascunhos, publicação, edição, conflito entre versões, validação de arquivos e ocultação reversível.

O lint integral do scaffold contém avisos preexistentes nos componentes UI não utilizados. A verificação focada do código do portfólio é `npx oxlint app components/portfolio-gallery.tsx components/portfolio-manager.tsx lib db tests`.
