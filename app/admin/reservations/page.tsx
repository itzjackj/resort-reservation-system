import { prisma } from "@/lib/prisma";
import CancelReservationButton from "@/components/CancelReservationButton";

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    include: {
      room: {
        include: {
          resort: true,
        },
      },
    },
    orderBy: {
      checkIn: "asc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          All Reservations
        </h1>
        <p className="text-sm text-muted-foreground">
          Admin overview of all bookings
        </p>
      </div>

      {reservations.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No reservations found.
        </div>
      )}

      <div className="space-y-4">
        {/* Column headers */}
        <div className="hidden md:grid grid-cols-4 gap-4 px-5 text-xs font-medium text-muted-foreground">
          <div>Resort</div>
          <div>Guest</div>
          <div>Dates</div>
          <div className="text-right">Actions</div>
        </div>

        {reservations.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="font-medium">
                  {r.room.resort.name}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Room: {r.room.name}
                </div>
              </div>

              <div className="font-medium">
                {r.guestName}
              </div>

              <div className="text-sm">
                {new Date(r.checkIn).toLocaleDateString()} →{" "}
                {new Date(r.checkOut).toLocaleDateString()}
              </div>

              <div className="flex items-center justify-start md:justify-end">
                <CancelReservationButton reservationId={r.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}