import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function isAuthorized(request: Request) {
    return request.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD || 'admin123')
}

export async function GET(request: Request) {
    if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(messages)
}

export async function PATCH(request: Request) {
    if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, read } = await request.json()
    const message = await prisma.contactMessage.update({ where: { id }, data: { read } })
    return NextResponse.json(message)
}
