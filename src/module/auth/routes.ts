import { createRoute } from '@hono/zod-openapi';
import createRouter from '@lib/createRouter';
import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from '@lib/httpStatusCodes';
import { jsonContent } from '@lib/openapi/helpers';
import { ErrorResponse } from '@lib/openapi/helpers/json-internal-error';
import { schemaLogin, schemaSignup, schemaToken } from './interfaces';
import jsonMessage from '@lib/openapi/helpers/json-message';
import { login, signup, validate } from './controllers';

const router: any = createRouter();

router.openapi(
  createRoute({
    method: 'post',
    path: '/signup',
    tags: ['Autenticación'],
    description: 'Crear cuenta',
    request: {
      body: jsonContent(schemaSignup, 'Datos para crear la cuenta')
    },
    responses: {
      [OK]: jsonContent(schemaToken, 'Token'),
      [UNAUTHORIZED]: jsonMessage('Credenciales inválidas'),
      [INTERNAL_SERVER_ERROR]: ErrorResponse
    }
  }),
  signup
);

router.openapi(
  createRoute({
    method: 'post',
    path: '/login',
    tags: ['Autenticación'],
    description: 'Login with email and password',
    request: {
      body: jsonContent(schemaLogin, 'Correo enviado con éxito')
    },
    responses: {
      [OK]: jsonContent(schemaToken, 'Token'),
      [INTERNAL_SERVER_ERROR]: ErrorResponse
    }
  }),
  login
);

router.openapi(
  createRoute({
    method: 'post',
    path: '/validate',
    tags: ['Autenticación'],
    description: 'Validate the session token',
    responses: {
      [OK]: jsonMessage('Token válido'),
      [INTERNAL_SERVER_ERROR]: ErrorResponse
    }
  }),
  validate
);

export default router;
