"use client";

import { useState } from "react";

type Props = {
  reservationId: string;
  initialCheckIn: string;
  initialCheckOut: string;
  onUpdated?: () => void;
};

export default function EditReservationForm({
  reservationId,
  initialCheckIn,
  initialCheckOut,
  onUpdated,
}: Props) {
  const [checkIn, setCheckIn] = useState(initialCheckIn.slice(0, 10));
  const [checkOut, setCheckOut] = useState(initialCheckOut.slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/reservations/${reservationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkIn, checkOut }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed");
    } else {
      onUpdated?.();
    }

    setLoading(false);
  }

  return (
    <div style={{ marginTop: 6 }}>
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />

     <button
  type="button"
  onClick={save}
  disabled={loading}
>
  Save
</button>


      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
