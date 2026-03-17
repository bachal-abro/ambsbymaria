import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!promoCode) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 404 })
    }

    if (!promoCode.active) {
      return NextResponse.json({ error: 'This promo code is no longer active' }, { status: 400 })
    }

    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 })
    }

    return NextResponse.json({
      code: promoCode.code,
      discount: promoCode.discount,
      discountType: promoCode.discountType,
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
