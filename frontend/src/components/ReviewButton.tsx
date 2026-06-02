"use client";

import { useState } from "react";

export default function ReviewButton({
  childId,
}: {
  childId: string;
}) {
  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  async function handleReview() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/children/${childId}/review`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleReview}
      disabled={loading}
    >
      {success
        ? "Revisado!"
        : loading
        ? "Processando..."
        : "Marcar como revisado"}
    </button>
  );
}