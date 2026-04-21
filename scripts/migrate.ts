import { database } from '@config/connections';

async function main() {
  try {
    // Prisma migrations are handled via `prisma migrate dev` or `prisma migrate deploy`
    // This script can be used for any custom database operations if needed
    console.log('✅ Para aplicar migraciones usa: bunx prisma migrate dev');
    console.log('ℹ️ Para producción usa: bunx prisma migrate deploy');
  } finally {
    await database.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
