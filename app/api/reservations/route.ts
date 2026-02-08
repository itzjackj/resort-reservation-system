 import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { roomId, guestName, checkIn, checkOut } = body;

    if (!roomId || !guestName || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: "Check-out must be after check-in" },
        { status: 400 }
      );
    }

    // 🔒 Prevent overlapping reservations
    const overlapping = await prisma.reservation.findFirst({
      where: {
        roomId,
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "Room is already booked for selected dates" },
        { status: 409 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        roomId,
        guestName,
        checkIn: checkInDate,
        checkOut: checkOutDate,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json(
      { error: "roomId is required" },
      { status: 400 }
    );
  }

  const reservations = await prisma.reservation.findMany({
    where: { roomId },
    orderBy: { checkIn: "asc" },
  });

  return NextResponse.json(reservations);
}

// DELETE /api/reservations?id=xxx
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "id is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete reservation error:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 }
    );
  }
}
