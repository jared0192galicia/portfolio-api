import type { Hook } from '@hono/zod-openapi';
import { UNPROCESSABLE_ENTITY } from '@lib/httpStatusCodes';

const defaultHook: Hook<any, any, any, any> = (result: any, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        error: result.error
      },
      UNPROCESSABLE_ENTITY
    );
  }
};

export default defaultHook;
