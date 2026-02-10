import { prisma } from "@/lib/prisma";
import BookRoomForm from "@/components/BookRoomForm";
import EditReservationForm from "@/components/EditReservationForm";
import CancelReservationButton from "@/components/CancelReservationButton";
import Link from "next/link";
import AdminEditRoomPanel from "@/components/AdminEditRoomPanel";
import DeleteResortButton from "@/components/DeleteResortButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResortDetailsPage({ params }: PageProps) {
  const { id: resortId } = await params;

  const resort = await prisma.resort.findUnique({
    where: { id: resortId },
    include: {
      rooms: {
        include: {
          reservations: {
            orderBy: { checkIn: "asc" },
          },
        },
      },
    },
  });

  if (!resort) {
    return <div className="p-8">Resort not found</div>;
  }

  const isAdmin = true; // toggle for demo

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {resort.name}
          </h1>
          <p className="text-muted-foreground">{resort.location}</p>
          {resort.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {resort.description}
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-4">
            <Link
              href={`/admin/resorts/${resort.id}/rooms/new`}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition"
            >
              + Add room
            </Link>
            <DeleteResortButton resortId={resort.id} />
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Rooms</h2>

      {resort.rooms.length === 0 && (
        <p className="text-sm text-muted-foreground">No rooms yet.</p>
      )}

      <div className="space-y-6">
        {resort.rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            {/* Room header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-semibold">
                  {room.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  ₱{room.price.toLocaleString()} • {room.capacity} guests
                </div>
              </div>

              {isAdmin && (
                <AdminEditRoomPanel
                  roomId={room.id}
                  price={room.price}
                  capacity={room.capacity}
                />
              )}
            </div>

            {/* Booking Form */}
            <div className="mb-6 mt-4">
              <BookRoomForm roomId={room.id} />
            </div>

            {/* Reservations */}
            <div className="mt-4">
              <div className="text-sm font-semibold mb-3 text-muted-foreground">
                Reservations
              </div>

              {room.reservations.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No reservations yet
                </div>
              )}

              <div className="space-y-2">
                {room.reservations.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-md border bg-background px-4 py-3 text-sm space-y-2"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-medium">
                        {r.guestName}
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(r.checkIn).toLocaleDateString()} →{" "}
                        {new Date(r.checkOut).toLocaleDateString()}
                      </div>
                    </div>

                    {isAdmin && (
                      <EditReservationForm
                        reservationId={r.id}
                        initialCheckIn={
                          r.checkIn.toISOString().split("T")[0]
                        }
                        initialCheckOut={
                          r.checkOut.toISOString().split("T")[0]
                        }
                      />
                    )}

                    {isAdmin && (
                      <div className="pt-2">
                        <CancelReservationButton
                          reservationId={r.id}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}