import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(promoCodes)
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, discount, discountType, active, expiresAt } = body

    if (!code || typeof discount !== 'number') {
      return NextResponse.json({ error: 'Code and valid discount are required' }, { status: 400 })
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discount,
        discountType: discountType || 'flat',
        active: active !== undefined ? active : true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return NextResponse.json(promoCode)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 })
    }
    console.error('Error creating promo code:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, active, discount, code, discountType, expiresAt } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(discount !== undefined && { discount }),
        ...(discountType && { discountType }),
        ...(active !== undefined && { active }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      },
    })

    return NextResponse.json(promoCode)
  } catch (error) {
    console.error('Error updating promo code:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.promoCode.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promo code:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
