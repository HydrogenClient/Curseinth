import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  adapter: "sqlite",
  db: { url: "file:./dev.db" },
});

export default prisma;
