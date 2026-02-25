import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    try {
        const { name, email, phone, subject, message } = await request.json()

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        await prisma.contactMessage.create({
            data: { name, email, phone: phone || '', subject, message },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }
}
