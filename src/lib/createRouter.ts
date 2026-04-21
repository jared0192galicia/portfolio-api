import { OpenAPIHono } from '@hono/zod-openapi';
import { AppBindigs } from './types';

function createRouter() {
  return new OpenAPIHono<AppBindigs>({
    strict: false
  });
}

export default createRouter;
