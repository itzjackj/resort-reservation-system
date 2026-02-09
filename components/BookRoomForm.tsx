"use client";

import { useState } from "react";

type Props = {
  roomId: string;
};

export default function BookRoomForm({ roomId }: Props) {
  const [guestName, setGuestName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          guestName,
          checkIn,
          checkOut,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage("✅ Reservation created!");
      setGuestName("");
      setCheckIn("");
      setCheckOut("");
    } catch (err) {
  if (err instanceof Error) {
    setMessage(`❌ ${err.message}`);
  } else {
    setMessage("❌ Something went wrong");
  }
}
    finally {
      setLoading(false);
    }
  }

  return (
  <form onSubmit={handleSubmit} className="mt-4">
    <div className="rounded-lg border bg-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Guest name</label>
          <input
            className="border rounded-md px-3 py-2 text-sm"
            placeholder="Guest name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Check-in</label>
          <input
            type="date"
            className="border rounded-md px-3 py-2 text-sm"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Check-out</label>
          <input
            type="date"
            className="border rounded-md px-3 py-2 text-sm"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-9 rounded-md bg-black text-white text-sm px-4 disabled:opacity-50"
        >
          {loading ? "Booking..." : "Book room"}
        </button>
      </div>

      {message && (
        <div
          className={`mt-3 text-sm ${
            message.startsWith("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  </form>
);
    
}
