import { prisma } from "@/app/lib/prisma";
import { Product } from "@/app/lib/product";
import { NextResponse } from 'next/server';


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const productid = parseInt((await params).id, 10)

  try {
    const product = await prisma.product.findUnique({
      where: { id: productid }
    })
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 })
    return NextResponse.json({ product }, { status: 200 })
  } catch (error) {
    console.error("Failed to GET/load Product", error)
    return NextResponse.json({ message: "Failed to GET/load Product" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const productid = parseInt((await params).id, 10)
  if (Number.isNaN(productid)) {
    return NextResponse.json({ message: "Invalid product id" }, { status: 400 })
  }
  let { price, stockCount }: Partial<Product> = await req.json()
  
  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    return NextResponse.json({ message: "Price must be a number greater then 0" }, { status: 400 })
  }
  if (stockCount !== undefined && (typeof stockCount !== "number" || stockCount < 0)) {
    return NextResponse.json({ message: "Stock count must be a non-negative number" }, { status: 400 })
  }

  try {
    const existing = await prisma.product.findUnique({ where: { id: productid } })
    if (!existing) {
      return NextResponse.json({ message: "Not a valid Product Id" }, { status: 400 })
    }

    if (price === 0) { price = existing.price}
    if (stockCount === 0) {stockCount = existing.stockCount}

    const updated = await prisma.product.update({
      where: { id: productid },
      data: { price: price, stockCount: stockCount }
    })
    return NextResponse.json({ updatedProduct: updated }, { status: 200 })
  } catch (error) {
    console.error("Failed to PATCH/update Product", error)
    return NextResponse.json({ message: "Failed to PATCH/update Product" }, { status: 500 }) // was missing `return` here before
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const productid = parseInt((await params).id, 10)
  if (Number.isNaN(productid)) {
    return NextResponse.json({ message: "Invalid product id" }, { status: 400 })
  }

  try {
    await prisma.product.delete({ where: { id: productid } })
    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.error("Failed to DELETE Product", error)
    return NextResponse.json({ message: "Failed to DELETE Product" }, { status: 500 })
  }
}