import type { MiddlewareHandler } from 'hono';

function serveEmojiFavicon(emoji: string): MiddlewareHandler {
  return async (context, next) => {
    if (context.req.path === '/favicon.ico') {
      context.header('Content-Type', 'image/svg+xml');
      return context.body(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" x="-0.1em" font-size="90">${emoji}</text></svg>`
      );
    }
    return next();
  };
}

export default serveEmojiFavicon;
