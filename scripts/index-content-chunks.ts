import { PrismaClient } from "@prisma/client";
import { rebuildContentChunks } from "../src/server/services/content-indexer";

const prisma = new PrismaClient();

async function main() {
  const result = await rebuildContentChunks(prisma);
  console.log(`Indexed ${result.chunks} chunks from ${result.lessons} lessons`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
