import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

function createPrismaClient() {
  return new PrismaClient().$extends(withAccelerate())
}

type PrismaClientAccelerate = ReturnType<typeof createPrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientAccelerate | undefined
}

export const prisma: PrismaClientAccelerate = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
