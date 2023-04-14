// * This code declare prismadb as a global variable and used PrismaClient as namespace.

import { PrismaClient } from '@prisma/client';

declare global {
  namespace globalThis {
    var prismadb: PrismaClient;
  }
}
