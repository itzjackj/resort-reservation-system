"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default function AddRoomPage({ params }: Props) {
  const resortId = params.id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resortId,
          name,
          price: Number(price),
          capacity: Number(capacity),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create room");
        setLoading(false);
        return;
      }

      router.push(`/resorts/${resortId}`);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Add Room
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Room name
          </label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Price
          </label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Capacity
          </label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            min="1"
          />
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create room"}
        </button>
      </form>
    </div>
  );
}
