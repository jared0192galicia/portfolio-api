export default function getIPAddress(context: any): string | undefined {
  const forwarded: string | null =
    context.req.raw.headers.get('x-forwarded-for');
  const userIP: string = forwarded ? forwarded.split(',')[0] : undefined;

  return userIP;
}
