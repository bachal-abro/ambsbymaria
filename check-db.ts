import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const all = await prisma.product.count()
  const featured = await prisma.product.count({ where: { featured: true } })
  console.log(`All: ${all}, Featured: ${featured}`)
  const rings = await prisma.product.count({ where: { category: 'rings', featured: false } })
  const necklaces = await prisma.product.count({ where: { category: 'necklaces', featured: false } })
  console.log(`Rings: ${rings}, Necklaces: ${necklaces}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
