import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Tests only a local built Worker. Never send simulated auth headers to a deployed Site.
const base = 'http://127.0.0.1:8787';
const admin = {
  'oai-authenticated-user-id': 'local_seedy',
  'oai-authenticated-user-email': 'seedy@sites.test',
};
const mutation = { ...admin, Origin: base };
const image = await readFile(
  new URL('../public/titanium-logo.png', import.meta.url),
);
const title = `Teste local ${Date.now()}`;
function form({
  published = false,
  retained = [],
  updated_at = '',
  photos = [new Blob([image], { type: 'image/png' })],
  name = title,
} = {}) {
  const body = new FormData();
  for (const [key, value] of Object.entries({
    title: name,
    category: 'Corrimãos e escadas',
    description: 'Teste isolado, nunca publicado no site online.',
    location: 'Ambiente local',
    published: String(published),
    retained: JSON.stringify(retained),
    updated_at,
  }))
    body.set(key, value);
  for (const photo of photos) body.append('photos', photo, 'teste.png');
  return body;
}
async function request(path, init = {}, expected = 200) {
  const response = await fetch(base + path, init);
  assert.equal(
    response.status,
    expected,
    `${init.method || 'GET'} ${path}: ${await response.clone().text()}`,
  );
  return response;
}
await request('/');
const homeHtml = await (await request('/')).text();
assert.match(homeHtml, /soldagem-real.jpeg/);
assert.match(homeHtml, /Combinamos a visita/);
assert.match(homeHtml, /tiramos as medidas/);
assert.doesNotMatch(homeHtml, /soldagem-oficina.png|escada-corrimao.png/);
await request('/soldagem-real.jpeg');
for (const photo of [
  'corrimao-brasil',
  'escada-emergencia-brasil',
  'portao-ferro-brasil',
  'grade-janela-brasil',
  'estrutura-metalica',
  'cobertura-quadra-brasil',
]) {
  assert.ok(
    homeHtml.includes(`/services/${photo}.jpg`),
    `Service photo missing from page: ${photo}`,
  );
  await request(`/services/${photo}.jpg`);
}
assert.match(await (await request('/painel')).text(), /Entrar com ChatGPT/);
assert.match(
  await (await request('/painel', { headers: admin })).text(),
  /Meu portfólio/,
);
await request('/api/trabalhos?painel=1', {}, 403);
await request(
  '/api/trabalhos',
  { method: 'POST', headers: { Origin: base } },
  403,
);
await request(
  '/api/trabalhos',
  {
    method: 'POST',
    headers: { ...admin, Origin: 'https://wrong.example' },
  },
  403,
);
await request(
  '/api/trabalhos',
  {
    method: 'POST',
    body: form({ photos: [new Blob(['not a photo'])] }),
    headers: mutation,
  },
  400,
);
await request(
  '/api/trabalhos',
  { method: 'POST', body: form({ photos: [] }), headers: mutation },
  400,
);
await request(
  '/api/trabalhos',
  {
    method: 'POST',
    body: form({ photos: Array(7).fill(new Blob([image])) }),
    headers: mutation,
  },
  400,
);
let project = (
  await (
    await request(
      '/api/trabalhos',
      { method: 'POST', body: form(), headers: mutation },
      201,
    )
  ).json()
).project;
const id = project.id;
const key = project.images[0];
let visible = (await (await request('/api/trabalhos')).json()).projects;
assert.ok(
  !visible.some((p) => p.id === id),
  'Draft must be hidden from public list',
);
assert.ok(
  (
    await (await request('/api/trabalhos?painel=1', { headers: admin })).json()
  ).projects.some((p) => p.id === id),
);
await request(`/api/fotos/${key}`, {}, 404);
const privatePhoto = await request(`/api/fotos/${key}`, { headers: admin });
assert.equal(privatePhoto.headers.get('content-type'), 'image/png');
assert.equal(privatePhoto.headers.get('cache-control'), 'no-store');
assert.equal(privatePhoto.headers.get('x-content-type-options'), 'nosniff');
assert.deepEqual(
  Buffer.from(await privatePhoto.arrayBuffer()),
  image,
  'Uploaded bytes must persist unchanged',
);
const stale = project.updated_at;
project = (
  await (
    await request(`/api/trabalhos/${id}`, {
      method: 'PATCH',
      headers: { ...mutation, 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: true, updated_at: project.updated_at }),
    })
  ).json()
).project;
visible = (await (await request('/api/trabalhos')).json()).projects;
assert.ok(visible.some((p) => p.id === id && p.published));
await request(`/api/fotos/${key}`);
await request(
  `/api/trabalhos/${id}`,
  {
    method: 'PUT',
    headers: mutation,
    body: form({ retained: [key], photos: [], updated_at: stale }),
  },
  409,
);
project = (
  await (
    await request(`/api/trabalhos/${id}`, {
      method: 'PUT',
      headers: mutation,
      body: form({
        name: `${title} editado`,
        published: true,
        retained: [key],
        photos: [],
        updated_at: project.updated_at,
      }),
    })
  ).json()
).project;
assert.equal(project.title, `${title} editado`);
await request(
  `/api/trabalhos/${id}`,
  {
    method: 'PUT',
    headers: mutation,
    body: form({
      retained: ['11111111-1111-1111-1111-111111111111.png'],
      photos: [],
      updated_at: project.updated_at,
    }),
  },
  400,
);
await request(`/api/trabalhos/${id}`, {
  method: 'PATCH',
  headers: { ...mutation, 'Content-Type': 'application/json' },
  body: JSON.stringify({ published: false, updated_at: project.updated_at }),
});
await request(`/api/fotos/${key}`, {}, 404);
assert.ok(
  !(await (await request('/api/trabalhos')).json()).projects.some(
    (p) => p.id === id,
  ),
);
console.log(
  'PASS: static images, owner panel, anonymous denial, Origin protection, invalid uploads, D1/R2 upload persistence, draft isolation, publication, editing, conflict detection, retained-photo ownership, hiding.',
);
console.log(`Local-only test record retained as hidden draft: ${id}`);
