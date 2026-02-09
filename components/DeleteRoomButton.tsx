"use client";

import { useRouter } from "next/navigation";

export default function DeleteRoomButton({
  roomId,
}: {
  roomId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm("Delete this room?");

    if (!ok) return;

    const res = await fetch(`/api/rooms/${roomId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete room");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-600 hover:underline"
    >
      Delete room
    </button>
  );
}
