import { Suspense } from 'react'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import type { Product } from '@/types'
import ShopContent from './ShopContent'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Shop Premium Handcrafted Jewellery | AmbsbyMaria',
  description: 'Explore our exquisite collection of premium handcrafted rings, earrings, necklaces, and bracelets. Trendy designs for every style at AmbsbyMaria.',
  alternates: {
    canonical: '/shop',
  },
}

export default async function ShopPage() {
  const dbProducts = await prisma.product.findMany({
    include: { materials: { include: { material: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const serializedProducts = dbProducts.map((p: any) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    images: JSON.parse(p.images),
    specifications: JSON.parse(p.specifications),
    materials: p.materials.map((pm: any) => pm.material),
  }))

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', item: '/' },
          { name: 'Shop', item: '/shop' },
        ]} 
      />
      <Suspense fallback={<div className="min-h-screen bg-luxury-black pt-32 pb-20" />}>
        <ShopContent initialProducts={serializedProducts as unknown as Product[]} />
      </Suspense>
    </>
  )
}
