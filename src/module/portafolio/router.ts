import { createRoute } from '@hono/zod-openapi';
import createRouter from '@lib/createRouter';
import { INTERNAL_SERVER_ERROR, OK } from '@lib/httpStatusCodes';
import { jsonContent } from '@lib/openapi/helpers';
import { ErrorResponse } from '@lib/openapi/helpers/json-internal-error';
import { locationSchema } from './interfaces';
import jsonMessage from '@lib/openapi/helpers/json-message';
import { postLocation } from './controller';

const router: any = createRouter();

router.openapi(
  createRoute({
    method: 'post',
    path: '/coordenadas',
    tags: ['Sistemas'],
    description: 'Registrar una ubicacion',
    request: {
      body: jsonContent(locationSchema, 'Datos de la ubicacion')
    },
    responses: {
      [OK]: jsonMessage('Visita registrada con éxito'),
      [INTERNAL_SERVER_ERROR]: ErrorResponse
    }
  }),
  postLocation
);

export default router;