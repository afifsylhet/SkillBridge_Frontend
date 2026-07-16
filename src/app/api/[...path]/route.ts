// Catch-all proxy: forwards every /api/* request to the real backend.
//
// Why proxy?
//   In production the frontend and backend live on different hosts.
//   By proxying through Next.js, the browser only ever talks to the frontend
//   origin — so Set-Cookie lands on the frontend domain.
import { type NextRequest } from 'next/server';

function resolveBackendBase(): string {
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
  'content-encoding',
]);

function filterHeaders(input: Headers): Headers {
  const out = new Headers();
  input.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) out.append(key, value);
  });
  return out;
}

async function forward(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
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

    const responseHeaders = filterHeaders(upstream.headers);
    responseHeaders.delete('set-cookie');
    for (const cookie of upstream.headers.getSetCookie()) {
      const sanitized = cookie.replace(/;\s*Domain=[^;]*/i, '');
      responseHeaders.append('set-cookie', sanitized);
    }

    const responseBody = await upstream.arrayBuffer();

    return new Response(responseBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'PROXY_ERROR',
          message: error instanceof Error ? error.message : 'Proxy error',
        },
      }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const OPTIONS = forward;
