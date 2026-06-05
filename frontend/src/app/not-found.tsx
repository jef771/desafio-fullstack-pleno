import Header from "@/components/Header";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
          
          <div className="text-5xl mb-4">⚠️</div>

          <h1 className="text-xl font-semibold text-gray-800">
            Criança não encontrada
          </h1>

          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            O registro solicitado não foi localizado no sistema.
            Verifique se o identificador está correto ou retorne para a lista de registros.
          </p>

          <div className="mt-6">
            <Link
              href="/children"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Voltar para a lista
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Sistema de Gestão Municipal
          </p>
        </div>
      </div>
    </main>
  );
}