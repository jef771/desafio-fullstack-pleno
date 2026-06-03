"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      router.push("/");
      router.refresh();
    } catch {
      setError(
        "Usuário ou senha inválidos"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/images/Logo-Prefeitura-horizontal-azul.png"
            alt="Prefeitura do Rio"
            width={260}
            height={80}
            priority
          />

          <h1 className="mt-6 text-center text-2xl font-semibold text-slate-800">
            Painel de Monitoramento Infantil
          </h1>
          
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-[var(--rio-blue)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Senha
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-[var(--rio-blue)] focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[var(--rio-blue)] py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Entrando..."
                : "ACESSAR"}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}