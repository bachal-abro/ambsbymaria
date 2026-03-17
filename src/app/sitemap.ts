import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ambsbymaria.com'

  // Fetch all products to include in sitemap
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const productEntries = products.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const staticPages = [
    '',
    '/about',
    '/contact',
    '/shop',
    '/shipping-policy',
    '/return-policy',
    '/privacy-policy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  return [...staticPages, ...productEntries]
}
