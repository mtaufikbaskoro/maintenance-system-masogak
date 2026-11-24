
import { readFileSync } from "node:fs";
import path from "node:path";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL must be configured before using the database.");
  }

  const url = new URL(connectionString);

  // Use Vercel's environment variable when available;
  // otherwise load the certificate from the project.
  const ca =
    process.env.DATABASE_CA_CERT ??
    readFileSync(
      path.join(process.cwd(), "certs/isrg-root-x1.pem"),
      "utf8"
    );

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: Number(
      process.env.DATABASE_CONNECTION_LIMIT ?? 5
    ),
    ssl: {
      ca,
      rejectUnauthorized: true,
    },
  });

  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
