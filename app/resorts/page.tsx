import Link from "next/link";
import { prisma } from "@/lib/prisma";


export default async function ResortsPage() {
  const resorts = await prisma.resort.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Resorts
        </h1>
        <p className="text-muted-foreground">
          Browse and manage available resorts
        </p>
      </div>

      {resorts.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No resorts yet.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resorts.map((r) => (
          <Link
            key={r.id}
            href={`/resorts/${r.id}`}
            className="group rounded-xl border bg-card p-5 shadow-sm transition
                       hover:shadow-md hover:border-foreground/20"
          >
            <div className="flex flex-col gap-2">
              <div className="text-lg font-semibold leading-tight group-hover:underline">
                {r.name}
              </div>

              <div className="text-sm text-muted-foreground">
                {r.location}
              </div>

              <div className="pt-2 text-xs text-muted-foreground">
                View rooms →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
