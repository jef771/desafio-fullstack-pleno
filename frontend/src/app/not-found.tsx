import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Criança não encontrada
      </h1>

      <p className="mt-4">
        O registro solicitado não existe.
      </p>

      <Link
        href="/children"
        className="mt-4 inline-block"
      >
        Voltar para a lista
      </Link>
    </main>
  );
}