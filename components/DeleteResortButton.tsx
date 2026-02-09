"use client";

import { useRouter } from "next/navigation";

export default function DeleteResortButton({
  resortId,
}: {
  resortId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm(
      "Are you sure you want to delete this resort?"
    );

    if (!ok) return;

    const res = await fetch(`/api/resorts/${resortId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/resorts");
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-600 hover:underline"
    >
      Delete resort
    </button>
  );
}
