// * This code exports an instance of PrismaClient, which is a database client for the Prisma ORM.
// * The instance is created and stored as a singleton object, so that it can be reused across multiple modules in the application.

import { PrismaClient } from '@prisma/client';

const client = global.prismadb || new PrismaClient();
if (process.env.NODE_ENV === 'production') global.prismadb = client;

export default client;
