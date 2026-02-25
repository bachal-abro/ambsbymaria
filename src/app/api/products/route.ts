import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const products = await prisma.product.findMany({
        where: category ? { category } : undefined,
        include: { materials: { include: { material: true } } },
        orderBy: { featured: 'desc' },
    })

    const mapped = products.map((p) => ({
        ...p,
        images: JSON.parse(p.images),
        specifications: JSON.parse(p.specifications),
        materials: p.materials.map((pm) => pm.material),
    }))

    return NextResponse.json(mapped)
}
