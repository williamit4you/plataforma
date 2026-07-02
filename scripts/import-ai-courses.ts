import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { rebuildContentChunks } from "../src/server/services/content-indexer";
import { importAiCoursePayload } from "../src/server/services/course-importer";

const prisma = new PrismaClient();

const files = [
  "content/ai-courses/google-ads-do-zero-ao-primeiro-anuncio.json",
  "content/ai-courses/meta-ads-para-afiliados-e-produtos-fisicos.json",
];

async function main() {
  for (const file of files) {
    const fullPath = path.resolve(process.cwd(), file);
    const payload = JSON.parse(await readFile(fullPath, "utf8")) as unknown;
    const result = await importAiCoursePayload(prisma, payload);
    console.log(`Imported ${result.courseSlug}: ${result.modules} modules, ${result.lessons} lessons`);
  }
  const indexResult = await rebuildContentChunks(prisma);
  console.log(`Indexed ${indexResult.chunks} chunks from ${indexResult.lessons} lessons`);
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
