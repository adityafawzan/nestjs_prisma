import { PrismaClient } from '@prisma/client';
import { withExclude } from 'prisma-exclude';

export const prismaExclude = withExclude(new PrismaClient());
