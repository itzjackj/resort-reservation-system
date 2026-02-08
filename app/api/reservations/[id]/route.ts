import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  req: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const body = await req.json();
    const { checkIn, checkOut } = body;

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing dates" },
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

    // get the reservation first (to know its roomId)
    const existing = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // 🔒 prevent overlaps (exclude this reservation)
    const overlapping = await prisma.reservation.findFirst({
      where: {
        roomId: existing.roomId,
        NOT: { id },
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

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
      },
    });

    return NextResponse.json(updated);

  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
