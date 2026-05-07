import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client/extension';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  connectionLimit: 10,
});

const base = new PrismaClient({
  adapter,
  log: ['query', 'info', 'error', 'warn'],
});

export const prisma = base.$extends({
  query: {
    async $allOperations({
      operation,
      model,
      args,
      query,
    }: {
      model?: string;
      operation: string;
      args: unknown;
      query: (a: unknown) => Promise<unknown>;
    }) {
      const start = performance.now();
      const result = await query(args);
      const ms = performance.now() - start;
      const label = `${model ?? '?'}.${operation}`;
      console.log(`[${label}] ${ms.toFixed(2)}ms`);
      if (ms > 500) {
        console.warn(`Slow query: ${label} - ${ms.toFixed(2)}ms`);
      }
      return result;
    },
  },
});

export default prisma;