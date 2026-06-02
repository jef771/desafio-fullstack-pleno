"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Algo deu errado
      </h1>

      <p className="mt-4">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="mt-4 border px-4 py-2"
      >
        Tentar novamente
      </button>
    </main>
  );
}