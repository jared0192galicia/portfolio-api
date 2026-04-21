import { OpenAPIHono } from '@hono/zod-openapi';

export interface AppBindigs {
  Variables: {};
}

export type AppOpenAPI = OpenAPIHono<AppBindigs>;
