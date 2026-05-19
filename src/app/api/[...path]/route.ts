// Catch-all proxy: forwards every /api/* request to the real backend.
//
// Why proxy?
//   In production the frontend (skillbridge-frontend.vercel.app) and the backend
//   (skillbridge-backend-three.vercel.app) live on different vercel.app subdomains.
//   Because vercel.app is on the Public Suffix List, cookies set by the backend
//   cannot be scoped to the frontend's domain. By proxying through Next.js, the
//   browser only ever talks to the frontend origin — so Set-Cookie lands on the
//   frontend domain where the RSC `cookies()` API can read it.
import { type NextRequest } from 'next/server';

function resolveBackendBase(): string {
  // Strip a trailing /api so we can re-append /api below — both forms are tolerated.
  const raw =
    process.env.API_URL_INTERNAL ||
    process.env.BACKEND_URL ||
    'http://localhost:4000';
  return raw.replace(/\/+$/, '').replace(/\/api$/, '');
}

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
  // Node's fetch transparently decompresses gzip/br/deflate responses, so the
  // body we forward is already plaintext. Leaving the header in would tell the
  // browser to decode again → ERR_CONTENT_DECODING_FAILED.
  'content-encoding',
]);

function filterHeaders(input: Headers): Headers {
  const out = new Headers();
  input.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) out.append(key, value);
  });
  return out;
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await ctx.params;
    const target = `${resolveBackendBase()}/api/${path.join('/')}${req.nextUrl.search}`;

    const requestHeaders = filterHeaders(req.headers);
    const hasBody = !['GET', 'HEAD'].includes(req.method);
    const body = hasBody ? await req.arrayBuffer() : undefined;

    const upstream = await fetch(target, {
      method: req.method,
      headers: requestHeaders,
      body,
      redirect: 'manual',
      cache: 'no-store',
    });

    // Pass response through verbatim, but strip any Domain= attribute from
    // Set-Cookie headers. Without Domain, the browser scopes the cookie to the
    // response's host (the frontend), which is exactly what we want — and it
    // prevents accidental rejection if the backend set Domain to its own host.
    const responseHeaders = filterHeaders(upstream.headers);
    responseHeaders.delete('set-cookie');
    for (const cookie of upstream.headers.getSetCookie()) {
      const sanitized = cookie.replace(/;\s*Domain=[^;]*/i, '');
      responseHeaders.append('set-cookie', sanitized);
    }

    // Clone the body to avoid consuming it
    const responseBody = await upstream.arrayBuffer();

    return new Response(responseBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[proxy] Error forwarding request:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'PROXY_ERROR', message: error instanceof Error ? error.message : 'Proxy error' },
      }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
