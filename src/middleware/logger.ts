import env from '@config/env';
import chalk from 'chalk';

const httpAbreviation: {
  [key: string]: string;
} = {
  GET: 'GET',
  POST: 'PST',
  DELETE: 'DEL',
  PUT: 'PUT'
};

function getStatusColor(method: number): string {
  if (method >= 200 && method < 300) {
    return chalk.green(method.toString());
  } else if (method >= 500 && method < 600) {
    return chalk.red(method.toString());
  } else if (method >= 400 && method < 500) {
    return chalk.yellow(method.toString());
  } else if (method >= 300 && method < 400) {
    return chalk.blue(method.toString());
  } else {
    return method.toString();
  }
}

export function getCurrentTimeMexicoCity(): string {
  const now = new Date();

  const mexicoCityTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
  );

  let hours = mexicoCityTime.getHours();
  const minutes = mexicoCityTime.getMinutes();
  const seconds = mexicoCityTime.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours < 10 ? '0' + hours : hours.toString();
  const strMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
  const strSeconds = seconds < 10 ? '0' + seconds : seconds.toString();

  return `${strHours}:${strMinutes}:${strSeconds} ${ampm}`;
}

function getMethodColor(_method: string) {
  const method = _method.trim();
  if (method === 'GET') return chalk.white.bgGreen(_method);
  if (method === 'PST') return chalk.white.bgYellow(_method);
  if (method === 'PUT') return chalk.white.bgBlue(_method);
  if (method === 'DEL') return chalk.white.bgRed(_method);
  return chalk.gray(_method);
}

const methodDirection: any = {
  response: chalk.bgWhite.black(' RES '),
  request: chalk.bgBlack.white(' REQ ')
};

function customLogger(ctx: any, message: string) {
  const [direction, time, status] = message.split(' ');

  const method: string = ctx.req.method;
  const port: number = env.PORT;
  const url: string = ctx.req.url.replace(`http://localhost:${port}`, '');

  const methodFormated: string = ` ${httpAbreviation[method]} `;
  const methodColor: string = getMethodColor(methodFormated);
  const statusColor: string = getStatusColor(parseInt(status));

  const _direction = methodDirection[direction];
  const _time = chalk.gray(getCurrentTimeMexicoCity());

  let finalTime = chalk.gray(time);

  const meta = time ? `${statusColor} ${finalTime}` : '';
  const log: string = `${_time} ${_direction} ${methodColor} ${url} ${meta}`;

  console.log(log);
}

async function logger(ctx: any, next: any) {
  const start: number = Date.now();
  customLogger(ctx, `request`);

  await next();

  const end: number = Date.now();
  const duration = Math.round(end - start);
  const _duration =
    duration < 1000
      ? `${Math.round(end - start)}ms`
      : `${Math.round((end - start) / 1000)}s`;

  customLogger(ctx, `response ${_duration} ${ctx.res.status}`);
}

export default logger;
