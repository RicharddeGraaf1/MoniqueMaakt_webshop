import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import createMollieClient, { PaymentMethod } from '@mollie/api-client'

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shipping } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Geen items in winkelwagen' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )

    // Create order in database
    const order = await prisma.order.create({
      data: {
        total,
        shippingName: shipping.name,
        shippingEmail: shipping.email,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingPostal: shipping.postal,
        shippingCountry: shipping.country || 'NL',
        status: 'pending',
        items: {
          create: items.map((item: { id: string; quantity: number; price: number }) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Create Mollie payment
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: total.toFixed(2),
      },
      description: `Bestelling #${order.id}`,
      redirectUrl: `${appUrl}/orders/${order.id}?status=paid`,
      webhookUrl: `${appUrl}/api/webhooks/mollie`,
      method: PaymentMethod.ideal,
      metadata: {
        orderId: order.id,
      },
    })

    // Update order with Mollie payment ID
    await prisma.order.update({
      where: { id: order.id },
      data: { molliePaymentId: payment.id },
    })

    return NextResponse.json({ paymentUrl: payment.getCheckoutUrl() })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het aanmaken van de bestelling' },
      { status: 500 }
    )
  }
}

