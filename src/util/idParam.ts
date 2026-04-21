export default function idParam(context) {
  const id = context.req.param('id');
  if (!id) return null;
  return parseInt(id, 10);
}
