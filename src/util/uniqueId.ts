import { nanoid } from 'nanoid';

export default function generateShortId(length: number = 12) {
  return nanoid(length);
}
