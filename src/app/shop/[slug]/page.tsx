import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { materials } from '@/lib/data'
import ProductClientLogic from './ProductClientLogic'
import type { Product } from '@/types'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'

export const revalidate = 3600 // revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true, images: true, category: true },
  })

  if (!product) return {}

  const images = JSON.parse(product.images)
  const imageUrl = images[0] || '/logo.png'

  return {
    title: `${product.name} | Trendy ${product.category.slice(0, -1)} | AmbsbyMaria`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | AmbsbyMaria`,
      description: product.description.slice(0, 160),
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | AmbsbyMaria`,
      description: product.description.slice(0, 160),
      images: [imageUrl],
    },
  }
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  })
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const dbProduct = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { materials: { include: { material: true } } },
  })

  if (!dbProduct) {
    notFound()
  }

  const product = {
    ...dbProduct,
    createdAt: dbProduct.createdAt.toISOString(),
    updatedAt: dbProduct.updatedAt.toISOString(),
    images: JSON.parse(dbProduct.images),
    specifications: JSON.parse(dbProduct.specifications),
    materials: dbProduct.materials.map((pm: any) => pm.material),
  } as unknown as Product

  // Fetch related products from the same category
  const relatedDbProducts = await prisma.product.findMany({
    where: {
      category: dbProduct.category,
      id: { not: dbProduct.id }
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  })

  const relatedProducts = relatedDbProducts.map((p: any) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    images: JSON.parse(p.images),
    specifications: JSON.parse(p.specifications),
  }))

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'AmbsbyMaria',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
      url: `https://ambsbymaria.com/shop/${params.slug}`,
    },
  }

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', item: '/' },
          { name: 'Shop', item: '/shop' },
          { name: product.name, item: `/shop/${params.slug}` },
        ]} 
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductClientLogic product={product} materials={materials} relatedProducts={relatedProducts as unknown as Product[]} />
    </>
  )
}
