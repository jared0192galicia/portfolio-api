import env from './env';

const port: number = env.PORT;
const mode: string = env.MODE;

const domain =
  mode == 'production' ? env.PRODUCTION_URL : `http://localhost:${port}`;

export default domain;
