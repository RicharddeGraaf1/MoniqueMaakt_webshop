import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import createMollieClient, { PaymentStatus } from '@mollie/api-client'

export const dynamic = 'force-dynamic'



export async function POST(request: NextRequest) {
  try {
    // Mollie sends webhook data as form data or JSON
    let paymentId: string | null = null
    try {
      const body = await request.json()
      paymentId = body.id
    } catch {
      const formData = await request.formData()
      paymentId = formData.get('id') as string
    }

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID missing' }, { status: 400 })
    }

    // Get payment status from Mollie
    const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY || '' })
    const payment = await mollieClient.payments.get(paymentId)

    // Find order by Mollie payment ID
    const order = await prisma.order.findFirst({
      where: { molliePaymentId: paymentId },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order status based on payment status
    let orderStatus = order.status
    if (payment.status === PaymentStatus.paid) {
      orderStatus = 'paid'
      // Update stock
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: order.id },
      })
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }
    } else if (payment.status === PaymentStatus.canceled || payment.status === PaymentStatus.expired) {
      orderStatus = 'cancelled'
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: orderStatus },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
