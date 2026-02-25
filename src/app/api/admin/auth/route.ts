import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: Request) {
    const { password } = await request.json()
    if (password === ADMIN_PASSWORD) {
        return NextResponse.json({ authenticated: true })
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
