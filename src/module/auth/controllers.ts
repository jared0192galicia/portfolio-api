import {
  queryInsertUser,
  queryGetAccountByUsername,
  queryGetAccountByEmail
} from './database';
import { CONFLICT, NOT_FOUND, OK, UNAUTHORIZED } from '@lib/httpStatusCodes';
import {
  CONFLICT as CONFLICT_MESSAGE,
  NOT_FOUND as NOT_FOUND_MESSAGE
} from '@lib/httpStatusMessages';
import { UNAUTHORIZED as UNAUTHORIZED_MESSAGE } from '@lib/httpStatusMessages';
import env from '@config/env';
import { AuthSecret, createToken, getAuthSecret, verify } from '@util/jwt';

export async function signup(context) {
  const { name, surname, username, email, password } = await context.req.json();

  // Buscar correo repetido
  const repeatedEmail = await queryGetAccountByEmail(email);
  const repeatedUsername = await queryGetAccountByUsername(username);

  if (repeatedEmail || repeatedUsername)
    return context.json({ message: CONFLICT_MESSAGE }, CONFLICT);

  // Encriptar la contraseña
  const hash: string = await Bun.password.hash(password);

  // crear cuenta
  const id = await queryInsertUser(
    name,
    surname,
    username,
    email,
    hash,
    'user'
  );

  // cuerpo del token
  const expirationTime: number = getTokenExpirationTime();

  const payload = {
    exp: expirationTime,
    id,
    email,
    name,
    surname,
    username,
    role: 'user'
  };

  const secret: AuthSecret = getAuthSecret(env.ACCESS_TOKEN_SECRET);
  const token: string = await createToken(payload, secret);

  return context.json({ accessToken: token });
}

export async function login(context) {
  // const ipAddress: string | undefined = getIPAddress(context) || '127.0.0.1';

  const { identifier, password } = await context.req.json();

  const user = await queryGetAccountByUsername(identifier);

  if (!user) return context.json({ message: NOT_FOUND_MESSAGE }, NOT_FOUND);

  const { idAccount: id, name, passwordHash, username } = user;

  // Averiguar si exedio los intentos de login
  // if (await exceedLoginAttemps(id, ipAddress))
  //   return context.json(
  //     { message: TOO_MANY_REQUESTS_MESSAGE },
  //     TOO_MANY_REQUESTS,
  //   );

  const passwordMatch: boolean = await Bun.password.verify(
    password,
    passwordHash
  );

  if (!passwordMatch) {
    // await insertLoginAttempt(id, false, ipAddress);

    return context.json({ message: UNAUTHORIZED_MESSAGE }, UNAUTHORIZED);
  }

  // const uid: string = generateUniqueId();
  const expirationTime: number = getTokenExpirationTime();

  const payload = {
    id,
    username,
    idAccount: id,
    name,
    expirationTime
  };

  const secret: AuthSecret = getAuthSecret(env.ACCESS_TOKEN_SECRET);
  const token: string = await createToken(payload, secret);

  // Generar registros login
  // await insertLoginAttempt(id, true, ipAddress);
  // await deleteLoginAttemps(id, ipAddress);

  return context.json({ accessToken: token });
}

export async function validate(context) {
  const authHeader = context.req.header('authorization');

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return context.json({ message: 'no token' }, UNAUTHORIZED);

  const secret = getAuthSecret(env.ACCESS_TOKEN_SECRET);
  const verified = await verify(token, secret);

  if (!verified)
    return context.json({ message: 'invalid token' }, UNAUTHORIZED);

  return context.json({ message: 'valid token' }, OK);
}
export async function logout(context) {
  return context.json({});
}

export function getTokenExpirationTime(): number {
  const expirationTime: number =
    Math.floor(Date.now() / 1000) + env.JWT_EXPIRATION;

  return expirationTime;
}
