import { PrismaClient } from '@prisma/client';
import {faker} from "@faker-js/faker";
const prisma = new PrismaClient()

async function main() {
    for (let index = 0; index < 100; index++) {
        const category = await prisma.category.create({
            data: {
              name:  faker.commerce.productName(),
            },
          })
    console.log(category)
    }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })