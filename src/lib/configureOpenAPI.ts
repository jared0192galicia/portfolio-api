import env from '@config/env';
import packageJSON from '../../package.json';
import { apiReference } from '@scalar/hono-api-reference';

function configureOpenAPI(app: any) {
  if (env.MODE == 'production') return;

  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'API',
      description: 'Documentación oficial'
    }
  });

  app.get(
    '/reference',
    apiReference({
      cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
      theme: 'kepler',
      defaultHttpClient: {
        targetKey: 'javascript',
        clientKey: 'fetch'
      },
      spec: {
        url: '/doc'
      },
      authentication: {
        preferredSecurityScheme: 'BearerAuth'
      }
    })
  );
}

export default configureOpenAPI;
