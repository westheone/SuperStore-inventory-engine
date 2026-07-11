import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Tell Prisma where to look for schema files
  schema: "prisma/schema.prisma",

  // Configure migration output
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },

  // Centralized database connection
  datasource: {
    url: process.env.DATABASE_URL,
  },
})