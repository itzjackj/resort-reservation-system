"use client";

import { useState } from "react";

type Props = {
  reservationId: string;
};

export default function CancelReservationButton({ reservationId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const ok = confirm("Cancel this reservation?");
    if (!ok) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/reservations?id=${reservationId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel reservation");
      }

      window.location.reload();
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("Failed to cancel reservation");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="
        text-xs
        text-red-600
        hover:text-red-700
        hover:underline
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {loading ? "Cancelling..." : "Cancel"}
    </button>
  );
}
