import dynamic from 'next/dynamic'
import Hero from '@/components/home/Hero'
import ProductShowcase from '@/components/home/ProductShowcase'
import { prisma } from '@/lib/db'
import type { Product } from '@/types'

const BrandStory = dynamic(() => import('@/components/home/BrandStory'))
const NewsletterSection = dynamic(() => import('@/components/home/NewsletterSection'))

export default async function HomePage() {
  const [dbFeaturedProducts, dbRings] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { materials: { include: { material: true } } },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { category: 'rings' },
      include: { materials: { include: { material: true } } },
      take: 4,
      orderBy: { createdAt: 'desc' },
    })
  ])

  const serializeProducts = (products: any[]) =>
    products.map((p: any) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      images: JSON.parse(p.images),
      specifications: JSON.parse(p.specifications),
      materials: p.materials.map((pm: any) => pm.material),
    }))

  const featuredProducts = serializeProducts(dbFeaturedProducts)
  const ringProducts = serializeProducts(dbRings)

  return (
    <>
      <Hero />
      <ProductShowcase
        initialProducts={featuredProducts as unknown as Product[]}
        title="Best Selling"
        description="Discover handpicked jewelry designed to bring elegance, beauty, and confidence to your everyday style."
        priority={true}
      />

      <ProductShowcase
        initialProducts={ringProducts as unknown as Product[]}
        title="Trending Rings"
        description="Modern ring designs that blend elegance with today’s most loved jewelry trends."
        bgColor="white"
      />

      <BrandStory />
      <NewsletterSection />
    </>
  )
}
