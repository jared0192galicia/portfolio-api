import './polyfill/compression.js';

import { serve } from 'bun';
import createApp from '@lib/createApp';
import env from '@config/env';
import configureOpenAPI from '@lib/configureOpenAPI';
import welcomeMessage from '@util/welcomeMessage';
import { generateMagicFetch } from '@scripts/generateMagicFetch';

import Auth from '@module/auth/routes';
import Portfolio from '@module/portafolio/router.js';

// Crear Aplicación
const app = createApp();

// Generar documentación basado en las rutas
configureOpenAPI(app);

// Registrar Modulos
app.route('/auth', Auth);
app.route('/portfolio', Portfolio);

serve({
  fetch: app.fetch,
  port: env.PORT
});

welcomeMessage();

// genera archivo fetch
generateMagicFetch(app);
