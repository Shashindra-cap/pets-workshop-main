import { createServer } from 'node:http';

const port = 5101;
const flaskUrl = 'http://127.0.0.1:5100';
const responses = new Map();

async function readJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) {
      throw new Error('Request body too large');
    }
  }
  return JSON.parse(body);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);

  if (request.method === 'GET' && url.pathname === '/health') {
    response.writeHead(200).end('ok');
    return;
  }

  if (request.method === 'POST' && url.pathname === '/__test/response') {
    const page = url.searchParams.get('page');
    if (!page) {
      response.writeHead(400).end('page is required');
      return;
    }

    try {
      responses.set(page, await readJson(request));
      response.writeHead(204).end();
    } catch (error) {
      response.writeHead(400).end(error instanceof Error ? error.message : String(error));
    }
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/dogs') {
    const fixture = responses.get(url.searchParams.get('page') ?? '');
    if (fixture?.networkError) {
      request.socket.destroy();
      return;
    }

    if (fixture) {
      response.statusCode = fixture.status ?? 200;
      if (fixture.statusText) response.statusMessage = fixture.statusText;
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify(fixture.payload));
      return;
    }
  }

  try {
    const upstream = await fetch(new URL(`${url.pathname}${url.search}`, flaskUrl));
    response.writeHead(upstream.status, upstream.statusText, {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
    });
    response.end(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    response.writeHead(502).end('Flask API unavailable');
  }
});

server.listen(port, '127.0.0.1');
