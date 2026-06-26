require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

// 1. Setup the adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// 2. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

// 3. Export global prisma api
module.exports = prisma;