import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/rooms?resortId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const resortId = searchParams.get("resortId");

  if (!resortId) {
    return new NextResponse("resortId is required", { status: 400 });
  }

  const rooms = await prisma.room.findMany({
    where: { resortId },
    include: {
      reservations: {
        orderBy: { checkIn: "asc" }, // 👈 important
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(rooms);
}

// POST /api/rooms
export async function POST(req: Request) {
  const body = await req.json();
  const { resortId, name, price, capacity } = body;

  if (!resortId || !name || !price || !capacity) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const room = await prisma.room.create({
    data: {
      resortId,
      name,
      price: Number(price),
      capacity: Number(capacity),
    },
  });

  return NextResponse.json(room, { status: 201 });
}
