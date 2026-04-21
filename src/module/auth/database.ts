import { database } from '@config/connections';
import env from '@config/env';
import toTitleCase from '@util/toTitleCase';

export async function queryGetAccountByEmail(email: string) {
  const row = await database.user.findUnique({
    where: {
      email: email
    },
    select: {
      id: true,
      name: true,
      passwordHash: true
    }
  });

  return row ? {
    idAccount: row.id,
    name: row.name,
    passwordHash: row.passwordHash
  } : undefined;
}

export async function queryGetAccountByUsername(username: string) {
  const row = await database.user.findUnique({
    where: {
      username: username
    },
    select: {
      id: true,
      username: true,
      name: true,
      passwordHash: true
    }
  });

  return row ? {
    username: row.username,
    idAccount: row.id,
    name: row.name,
    passwordHash: row.passwordHash
  } : undefined;
}

export async function queryInsertUser(
  name: string,
  surname: string,
  username: string,
  mail: string,
  password: string,
  role: string
) {
  // Note: Prisma schema doesn't have surname field, combining with name
  const fullName = `${toTitleCase(name)} ${toTitleCase(surname)}`;
  
  const record = await database.user.create({
    data: {
      name: fullName,
      username: username.toLowerCase(),
      email: mail.toLowerCase(),
      passwordHash: password,
      role: role
    },
    select: {
      id: true
    }
  });

  return record.id;
}

/**
 * Si se ha exedido el número máximo de intentos al iniciar sesión
 */
export async function exceedLoginAttemps(userId: number, ipAddress: string) {
  const maxLoginAttemps: number = Number(env.MAX_LOGIN_ATTEMPS);

  const loginAttempsTimeWindow: number = Number(
    env.LOGIN_ATTEMPTS_TIMEWINDOW_MINUTES
  );

  const now = new Date();
  const pastTime = new Date(now.getTime() - loginAttempsTimeWindow * 60 * 1000); // timeWindow in milliseconds

  const count = await database.loginAttempt.count({
    where: {
      idUser: userId,
      ipAddress: ipAddress,
      isSuccessful: false,
      attemptTimestamp: {
        gt: pastTime
      }
    }
  });

  return count >= maxLoginAttemps;
}

export async function insertLoginAttempt(
  userId: number,
  successful: boolean,
  ipAddress: string
) {
  try {
    await database.loginAttempt.create({
      data: {
        idUser: userId,
        attemptTimestamp: new Date(),
        isSuccessful: successful,
        ipAddress: ipAddress,
        userAgent: ''
      }
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Eliminar intento login
 */
export async function deleteLoginAttemps(idUser: number, ipAddress: string) {
  try {
    await database.loginAttempt.deleteMany({
      where: {
        idUser: idUser,
        ipAddress: ipAddress,
        isSuccessful: false
      }
    });
  } catch (error) {
    console.log(error);
  }
}
