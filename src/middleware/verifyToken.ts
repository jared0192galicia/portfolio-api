import env from '@config/env';
import { UNAUTHORIZED } from '@lib/httpStatusCodes';
import { UNAUTHORIZED as UNAUTHORIZED_MESSAGE } from '@lib/httpStatusMessages';
import { getAuthSecret, verify } from '@util/jwt';

/*
 * Middleware para verificar token del usuario
 */
export async function verifyToken(context, next) {
  try {
    const authHeader: string = context.req.header('authorization');
    const token: string = authHeader && authHeader.split(' ')[1];

    // No tiene token
    if (!token)
      return context.json({ message: UNAUTHORIZED_MESSAGE }, UNAUTHORIZED);

    const secret = getAuthSecret(env.ACCESS_TOKEN_SECRET);
    const valid = await verify(token, secret);

    if (!valid)
      return context.json({ message: UNAUTHORIZED_MESSAGE }, UNAUTHORIZED);

    await next();
  } catch (error) {
    console.log(error);
  }
}
