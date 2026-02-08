import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.room.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete room error:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { price, capacity } = body;

    if (price == null || capacity == null) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const room = await prisma.room.update({
      where: { id },
      data: {
        price: Number(price),
        capacity: Number(capacity),
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Update room error:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 }
    );
  }
}