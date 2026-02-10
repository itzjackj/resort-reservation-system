"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Resort = {
  id: string;
  name: string;
  location: string;
  description?: string | null;
};

export default function HomePage() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resorts")
      .then((res) => res.json())
      .then((data) => setResorts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Loading resorts...</p>;
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Resorts</h1>

      {resorts.length === 0 && (
        <p className="text-muted-foreground">No resorts found.</p>
      )}

      <ul className="space-y-4">
        {resorts.map((resort) => (
          <li
            key={resort.id}
            className="border rounded-lg p-4 space-y-1"
          >
            <h2 className="font-semibold">{resort.name}</h2>
            <p className="text-sm text-muted-foreground">
              {resort.location}
            </p>
            {resort.description && (
              <p className="text-sm">{resort.description}</p>
            )}
          </li>
        ))}
      </ul>

      <Button
        onClick={async () => {
          await fetch("/api/resorts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "UI Created Resort",
              location: "Palawan",
              description: "Created from UI",
            }),
          });

          const res = await fetch("/api/resorts");
          setResorts(await res.json());
        }}
      >
        Add Test Resort
      </Button>
    </main>
  );
}
