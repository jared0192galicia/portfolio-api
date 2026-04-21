import createRouter from './createRouter';
import { serveStatic } from 'hono/bun';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import serveAbout from '@middleware/about';
import serveRobots from '@middleware/serveRobots';
import serveEmojiFavicon from '@middleware/serveEmojiFavicon';
import notFound from '@middleware/notFound';
import onError from '@middleware/onError';
import logger from '@middleware/logger';

function createApp() {
  const app = createRouter()
    .use(
      '/public/*',
      serveStatic({
        root: '../'
      })
    )
    .use(compress())
    .use(cors())
    .use(serveAbout())
    .use(serveRobots())
    .use(serveEmojiFavicon('🟠'))
    .notFound(notFound)
    .onError(onError)
    .use(logger);

  return app;
}

export default createApp;
