"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteRoomButton from "./DeleteRoomButton";

type Props = {
  roomId: string;
  price: number;
  capacity: number;
};

export default function AdminEditRoomPanel({
  roomId,
  price,
  capacity,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [newPrice, setNewPrice] = useState(price.toString());
  const [newCapacity, setNewCapacity] = useState(capacity.toString());
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);

    await fetch(`/api/rooms/${roomId}`, {
      method: "PUT", // ✅ must match your route.ts
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: Number(newPrice),
        capacity: Number(newCapacity),
      }),
    });

    setLoading(false);
    setOpen(false);

    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      {!open && (
        <>
          <button
            onClick={() => setOpen(true)}
            className="text-sm text-muted-foreground hover:underline"
          >
            Edit
          </button>

          <DeleteRoomButton roomId={roomId} />
        </>
      )}

      {open && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-24 rounded-md border px-2 py-1 text-sm"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />

          <input
            type="number"
            className="w-16 rounded-md border px-2 py-1 text-sm"
            value={newCapacity}
            onChange={(e) => setNewCapacity(e.target.value)}
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
          >
            {loading ? "Saving…" : "Save"}
          </button>

          <button
            onClick={() => setOpen(false)}
            className="text-sm text-muted-foreground hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
