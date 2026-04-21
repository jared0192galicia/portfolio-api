/**
 * Obtener un string de parámetro sin símbolos ni espacios.
 */
export function stringParam(context, name: string): string {
  const value: string = context.req.param(name);
  let clean: string = value.trim().replace(/[^a-zA-Z0-9]/g, '');

  return clean;
}
