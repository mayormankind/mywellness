import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL || 'admin@mywellness.futa.edu.ng';
  const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || 'Admin@Wellness2025!';
  const ADMIN_NAME = 'System Administrator';

  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: { role: 'admin', isVerified: true },
    });
    console.log(`✅ Promoted ${ADMIN_EMAIL} to admin role.`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.create({
    data: {
      userName: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      isVerified: true,
      role: 'admin',
    },
  });

  console.log('');
  console.log('✅ Admin account created:');
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('');
  console.log('⚠️  Change this password immediately after first login.');
  console.log('   Override via ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD env vars before seeding.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
