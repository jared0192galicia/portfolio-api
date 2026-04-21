import chalk from 'chalk';
import { getCurrentTimeMexicoCity } from '@middleware/logger';

export default function print(...messages: any[]) {
  const time = chalk.gray(getCurrentTimeMexicoCity());
  console.log(time, ...messages);
}
