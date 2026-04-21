import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.POSTGRE_URL;

if (!connectionString) {
  throw new Error("La variable de entorno POSTGRE_URL no está definida.");
}

// 1. Configuramos el pool de conexiones de 'pg'
const pool = new pg.Pool({ connectionString });

// 2. Creamos el adaptador oficial
const adapter = new PrismaPg(pool);

// 3. Instanciamos el cliente
export const database = new PrismaClient({ adapter });

/**
 * Conección al enviador de mails
 */
export const mailSettings = {
  host: '',
  secure: true,
  auth: {
    user: '',
    pass: ''
  }
};
