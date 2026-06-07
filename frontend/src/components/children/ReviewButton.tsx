"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewButton({
  childId,
}: {
  childId: string;
}) {
  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const router = useRouter();

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

    setTimeout(() => {
      router.refresh();
    }, 1000);

  } finally {
    setLoading(false);
  }
}

  return (

    
    <div>
      <button
        type="button"
        onClick={handleReview}
        disabled={loading || success}
        aria-label={
          success
            ? "Caso marcado como revisado"
            : loading
            ? "Processando revisão do caso"
            : "Marcar caso como revisado"
        }
        aria-busy={loading}
        className={`
          inline-flex
          w-auto
          items-center
          justify-center
          gap-2
          rounded-xl
          px-6
          py-3
          text-sm
          font-semibold
          shadow-sm
          transition-all
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-70
          ${
            success
              ? `
                bg-green-600
                text-white
              `
              : `
                bg-[#1bb5d9]
                text-white
                hover:bg-[#169fbe]
              `
          }
        `}
      >
        {success && (
          <span aria-hidden="true">
            ✓
          </span>
        )}

        {loading
          ? "Processando..."
          : success
          ? "Revisado com sucesso"
          : "Marcar como revisado"}
      </button>

      <div
        className="sr-only"
        aria-live="polite"
      >
        {loading &&
          "Revisão em andamento"}

        {success &&
          "Caso revisado com sucesso"}
      </div>
    </div>
  );
}