import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function isAuthorized(request: Request) {
    return request.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD || 'admin123')
}

export async function GET(request: Request) {
    if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const orders = await prisma.order.findMany({
        include: { items: { include: { product: true, material: true } } },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
}

export async function PATCH(request: Request) {
    if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, status } = await request.json()
    const order = await prisma.order.update({ where: { id }, data: { status } })
    return NextResponse.json(order)
}
