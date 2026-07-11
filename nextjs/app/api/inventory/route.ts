import {prisma} from "@/app/lib/prisma";
import { Product } from "@prisma/client";
import { NextResponse } from 'next/server';



export async function GET() {
  try {
    const inventory = await prisma.product.findMany();

    return NextResponse.json({inventory}, {status: 200});
  } catch (error) {
    console.error("Failed to GET/load inventory", error);

    return NextResponse.json(
      { message: "Failed to GET/load inventory" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { name, category, price, stockCount }: Product = await req.json()

  if (typeof name !== "string"|| !name) {
    return NextResponse.json({message: "Product name is required and must be text"}, {status: 400});
  }
  if (typeof category !== "string" || !category) {
    return NextResponse.json({message: "Product category is required and must be text"}, {status: 400});
  }
  if(typeof price !== "number" || price < 0) {
    return NextResponse.json({message: "Price must be a number greater then 0"}, {status: 400});
  }
  if(typeof stockCount !== "number" || stockCount < 0) {
    return NextResponse.json({message: "Stock count must be a non-negative number"}, {status: 400})
  }

  try{
    const newProduct = await prisma.product.create({
      data: {name: name, category: category, price: price, stockCount: stockCount}
    })
    return NextResponse.json({newProduct}, {status:201})
  } catch (error) {
    console.error("Faild to POST/add Product", error);
    return NextResponse.json({message:"Faild to POST/add Product"}, {status:500})
  }
  
}

