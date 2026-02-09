"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  roomId: string;
  initialPrice: number;
  initialCapacity: number;
};

export default function EditRoomForm({
  roomId,
  initialPrice,
  initialCapacity,
}: Props) {
  const router = useRouter();

  const [price, setPrice] = useState(
    initialPrice.toString()
  );
  const [capacity, setCapacity] = useState(
    initialCapacity.toString()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/rooms/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: Number(price),
        capacity: Number(capacity),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to update room");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2">
        <input
          type="number"
          className="w-32 border rounded-md px-2 py-1 text-sm"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />

        <input
          type="number"
          className="w-28 border rounded-md px-2 py-1 text-sm"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="Capacity"
        />

        <button
          onClick={save}
          disabled={loading}
          className="text-sm rounded-md border px-3 hover:bg-muted disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
