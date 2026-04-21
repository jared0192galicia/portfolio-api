import { NOT_ACCEPTABLE } from '@lib/httpStatusCodes';
import type { MiddlewareHandler } from 'hono';

function serveRobots(): MiddlewareHandler {
  return async (context, next) => {
    if (context.req.path === '/robots.txt') {
      try {
        const path = './robots.txt';
        const file = Bun.file(path);

        const text = await file.text();

        context.header('Content-Type', 'text/plain');

        return context.text(text);
      } catch (error) {
        console.log(error);
        return context.text('robots.txt not found', NOT_ACCEPTABLE);
      }
    }
    return next();
  };
}

export default serveRobots;
