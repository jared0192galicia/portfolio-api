import { NOT_FOUND } from '@lib/httpStatusCodes';
import packageJSON from '../../package.json';
import type { MiddlewareHandler } from 'hono';

const about = {
  author:
    'Miguel Benjamin Rojas Cordoba, Elietzer Jared Galicia Cordoba, Paulino Torres Jiménez, Amando Brayan Vidal Romero.',
  version: packageJSON.version,
  company: ''
};

function serveAbout(): MiddlewareHandler {
  return async (context, next) => {
    if (context.req.path === '/') {
      try {
        return context.json(about);
      } catch (error) {
        console.log(error);

        return context.text('about not found', NOT_FOUND);
      }
    }
    return next();
  };
}

export default serveAbout;
