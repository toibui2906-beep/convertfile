import * as PrismaModule from '@prisma/client';

const { PrismaClient } = PrismaModule as any;

const globalForPrisma = global as unknown as { prisma: any };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'], // Bật log để tiện theo dõi câu lệnh SQL trong quá trình dev
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;