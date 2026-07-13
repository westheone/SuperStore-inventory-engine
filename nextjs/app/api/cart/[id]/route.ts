import {prisma} from "@/app/lib/prisma";
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ cartid: number }> }
) {
  const cartid = (await params).cartid
  const productid = await req.json()

  try {
    const item = await prisma.cartItem.findUnique({ where: { productId: productid } })
    if (!item) {
      return NextResponse.json({ message: "Out of stock or product not found" }, { status: 404 })
    }

    if (item.quantity <= 1) {
      await prisma.cartItem.delete({ where: { productId: productid } })
    } else {
      await prisma.cartItem.update({
        where: { productId: productid },
        data: { quantity: { decrement: 1 } }
      })
    }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Failed to PATCH/update Cartitem", error)
    return NextResponse.json({ message: "Failed to PATCH/update Cartitem" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ cartid: number }> }
) {
  const cartid = (await params).cartid

  try {
    const item = await prisma.cartItem.findUnique({ where: { cartid: cartid } })
    if (!item) {
      return NextResponse.json({ message: "Out of stock or product not found" }, { status: 404 })
    }

    await prisma.cartItem.delete({ where: { cartid: cartid } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Failed to DELETE Cartitem", error)
    return NextResponse.json({ message: "Failed to DELETE Cartitem" }, { status: 500 })
  }
}