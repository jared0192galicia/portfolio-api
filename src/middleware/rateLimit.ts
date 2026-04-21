import { FORBIDDEN, TOO_MANY_REQUESTS } from '@lib/httpStatusCodes';

const IPList = new Map();
const buffer = new Map();

interface BufferRecord {
  history: Date[];
}

const maxTimeSeconds: number = parseInt(Bun.env.RATELIMIT_MAX_TIME_SECONDS);
const maxRequests: number = parseInt(Bun.env.RATELIMIT_MAX_REQUESTS);

export default async function rateLimit(context, next) {
  const forwarded: string | null =
    context.req.raw.headers.get('x-forwarded-for');
  const userIP: string = forwarded ? forwarded.split(',')[0] : undefined;

  let instanceMaxRequests: number = maxRequests;

  if (IPList.has(userIP)) {
    const IP = IPList.get(userIP);

    // Revisar si esta baneada
    if (IP.banned) return context.text('IP Baneada', FORBIDDEN);
    // Revisar si tiene un limite especifico
    if (IP.maxRequests) instanceMaxRequests = IP.maxRequests;
  }

  const meta: BufferRecord = buffer.has(userIP)
    ? buffer.get(userIP)
    : {
        history: [new Date()]
      };

  buffer.set(userIP, meta);

  const amount: number = getTimeRangeNumber(meta.history);

  // Excedio el limite
  if (amount > instanceMaxRequests) {
    return context.text(
      'Demasiadas solicitudes. Por favor, inténtelo de nuevo más tarde.',
      TOO_MANY_REQUESTS
    );
  }

  // Agregar registro
  const exists: boolean = buffer.has(userIP);
  if (exists) {
    const record: Date = new Date();
    meta.history.push(record);
  }

  // Limpiar registros antiguos
  cleanOldRequests(meta.history);

  await next();
}

function getTimeRangeNumber(dates: Date[]): number {
  const now: Date = new Date();
  const range: Date = new Date(now.getTime() - maxTimeSeconds * 1000);

  return dates.filter((date) => date > range).length;
}

function cleanOldRequests(history: Date[]): void {
  const now = new Date();
  const range = new Date(now.getTime() - maxTimeSeconds * 1000);

  const filtered = history.filter((date) => date > range);
  history.splice(0, history.length, ...filtered);
}
