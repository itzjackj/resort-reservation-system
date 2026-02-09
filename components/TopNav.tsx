import Link from "next/link";

export default function TopNav() {
  return (
    <header className="border-b bg-background">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Public */}
          <Link
            href="/resorts"
            className="text-sm font-medium hover:underline"
          >
            Resorts
          </Link>

          {/* Admin section */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/reservations"
              className="text-sm font-medium hover:underline"
            >
              Admin
            </Link>

            <Link
              href="/admin/resorts/new"
              className="text-sm text-muted-foreground hover:underline"
            >
              Add resort
            </Link>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Resort Reservation System
        </div>
      </div>
    </header>
  );
}
