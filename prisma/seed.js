const prisma = require('./prisma.client');

async function main() {
  const inventory = await prisma.product.createMany({
    data:[
    { name: "Premium Wireless Headphones", category: "Electronics", price: 129.99, stockCount: 15 },
    { name: "Ergonomic Office Chair", category: "Furniture", price: 249.99, stockCount: 3 },
    { name: "Stainless Steel Water Bottle", category: "Fitness", price: 24.99, stockCount: 0  },
    { name: "Smart LED Desk Lamp", category: "Electronics", price: 59.99, stockCount: 8  },
    { name: "Memory Foam Pillow", category: "Furniture", price: 39.99, stockCount: 12 },
    { name: "Yoga Mat with Carrying Strap", category: "Fitness", price: 29.99, stockCount: 5 },
    { name: "Bluetooth Speaker", category: "Electronics", price: 89.99, stockCount: 2 },
    { name: "Adjustable Standing Desk Converter", category: "Furniture", price: 199.99, stockCount: 4 },
    { name: "Resistance Bands Set", category: "Fitness", price: 19.99, stockCount: 20 },
    { name: "4K Ultra HD Action Camera", category: "Electronics", price: 149.99, stockCount: 7 }
    ], 
    skipDuplicates: true,
  });
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });