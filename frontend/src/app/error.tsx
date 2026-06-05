"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
          
          <div className="text-5xl mb-4">🚨</div>

          <h1 className="text-xl font-semibold text-slate-800">
            Ocorreu um erro no sistema
        </h1>

          <p className="mt-3 text-sm text-slate-600">
          Não foi possível carregar os dados. Tente novamente ou volte para o painel.
        </p>

          {error?.digest && (
          <p className="mt-4 text-xs text-slate-400">
            Código: {error.digest}
          </p>
        )}
        </div>
      </div>
    </main>
  );

  
}