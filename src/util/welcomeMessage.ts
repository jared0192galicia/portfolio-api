import env from '@config/env';
import chalk from 'chalk';
import print from './print';

export default function welcomeMessage() {
  print(
    `Servidor iniciado en modo de ${
      env.MODE == 'development'
        ? chalk.blue('desarrollo')
        : chalk.green('producción')
    } en el puerto ${chalk.yellow(env.PORT)}`
  );
}
