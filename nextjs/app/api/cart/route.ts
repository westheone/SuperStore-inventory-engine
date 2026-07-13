import {prisma} from "@/app/lib/prisma";
import { CartItem } from "@/app/lib/cartitme"
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const cart = await prisma.cartItem.findMany({
      include: {product: {select: {price: true, name: true}}}
    })
    return NextResponse.json({cart}, {status: 200})
  } catch (error) {
    console.error("Failed to GET/load Cartitmes", error);
    return NextResponse.json({message: "Failed to GET/load CartItems"}, {status: 500})
  }
}

// fixed POST
export async function POST(req: Request) {
  const { productId, quantity }: CartItem = await req.json()

  if (typeof productId !== "number" || productId <= 0) {
    return NextResponse.json({ message: "Id must be a number greater then 0" }, { status: 400 })
  }
  if (typeof quantity !== "number" || quantity < 1) {
    return NextResponse.json({ message: "Quantity must be 1 or greater number" }, { status: 400 })
  }

  try {
    const productIn = await prisma.product.findUnique({ where: { id: productId } })
    if (!productIn || productIn.stockCount <= 0) {
      // 202 means "success" — that's wrong for an error case, use 409 or 400
      return NextResponse.json({ message: "Out of Stock, Sorry" }, { status: 409 })
    }

    const existing = await prisma.cartItem.findUnique({ where: { productId } })

    if (existing) {
      await prisma.cartItem.update({
        where: { cartid: existing.cartid },
        data: { quantity: { increment: quantity } }
      })
      return NextResponse.json({ status: "ok" }, { status: 201 })
    }

    await prisma.cartItem.create({ data: { productId, quantity } })
    return NextResponse.json({ status: "ok" }, { status: 200 })
  } catch (error) {
    console.error("Failed to POST/add Cartitem", error)
    return NextResponse.json({ message: "Failed to POST/add Cartitem" }, { status: 500 })
  }
}