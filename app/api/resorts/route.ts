import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/resorts
export async function GET() {
  try {
    const resorts = await prisma.resort.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resorts);
  } catch (error) {
    console.error("GET /api/resorts error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/resorts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location, description } = body;

    if (!name || !location) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const resort = await prisma.resort.create({
      data: {
        name,
        location,
        description,
      },
    });

    return NextResponse.json(resort, { status: 201 });
  } catch (error) {
    console.error("POST /api/resorts error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
