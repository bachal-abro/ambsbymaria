import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
    _req: Request,
    { params }: { params: { slug: string } }
) {
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: { materials: { include: { material: true } } },
    })

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
        ...product,
        images: JSON.parse(product.images),
        specifications: JSON.parse(product.specifications),
        materials: product.materials.map((pm) => pm.material),
    })
}
