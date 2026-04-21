import path from 'path';

export default function getPath(...args: string[]): string {
  const projectDirectory = process.cwd();
  return path.join(projectDirectory, '..', ...args);
}