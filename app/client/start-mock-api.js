import { createServer } from 'node:http';

const port = Number(process.env.API_PROXY_PORT || 5101);
const flaskPort = Number(process.env.FLASK_PORT || 5100);
const flaskUrl = `http://127.0.0.1:${flaskPort}`;
const responses = new Map();
const adoptionResponses = new Map();

async function readBody(request) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 1_000_000) {
      throw new Error('Request body too large');
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readJson(request) {
  return JSON.parse((await readBody(request)).toString());
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

  if (request.method === 'POST' && url.pathname === '/__test/adoption-response') {
    const dogId = url.searchParams.get('dogId');
    if (!dogId || !/^[1-9]\d*$/.test(dogId)) {
      response.writeHead(400).end('dogId is required');
      return;
    }

    try {
      adoptionResponses.set(dogId, await readJson(request));
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

  const adoptionPath = url.pathname.match(/^\/api\/dogs\/([1-9]\d*)\/adoption-requests$/);
  if (request.method === 'POST' && adoptionPath) {
    const fixture = adoptionResponses.get(adoptionPath[1]);
    if (fixture) {
      response.statusCode = fixture.status ?? 200;
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify(fixture.payload));
      return;
    }
  }

  try {
    const body = request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await readBody(request);
    const headers = request.headers['content-type']
      ? { 'content-type': request.headers['content-type'] }
      : undefined;
    const upstream = await fetch(new URL(`${url.pathname}${url.search}`, flaskUrl), {
      method: request.method,
      headers,
      body,
    });
    response.writeHead(upstream.status, upstream.statusText, {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
    });
    response.end(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    response.writeHead(502).end('Flask API unavailable');
  }
});

server.listen(port, '127.0.0.1');
