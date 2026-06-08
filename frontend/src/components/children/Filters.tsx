"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  bairro: string;
  hasAlerts: string;
  revisado: string;
  order: string;
  direction: string;
};

export default function Filters({
  bairro: initialBairro,
  hasAlerts: initialHasAlerts,
  revisado: initialRevisado,
  order: initialOrder,
  direction: initialDirection,
}: Props) {
  const router = useRouter();

  const [bairro, setBairro] =
    useState(initialBairro);

  const [hasAlerts, setHasAlerts] =
    useState(initialHasAlerts);

  const [revisado, setRevisado] =
    useState(initialRevisado);

  const [order, setOrder] =
    useState(initialOrder);

  const [direction, setDirection] =
    useState(initialDirection || "asc");

  function clearFilters() {
    setBairro("");
    setHasAlerts("");
    setRevisado("");
    setOrder("");
    setDirection("asc");

    router.push("/children?page=1");
  }

  function applyFilters() {
    const params = new URLSearchParams();

    if (bairro.trim()) {
      params.set("bairro", bairro);
    }

    if (hasAlerts) {
      params.set("has_alerts", hasAlerts);
    }

    if (revisado) {
      params.set("revisado", revisado);
    }

    if (order) {
      params.set("order", order);
      params.set("direction", direction);
    }

    params.set("page", "1");

    router.push(
      `/children?${params.toString()}`
    );
  }

  return (
    <section
      aria-label="Filtros de pesquisa"
      className="
        mb-6
        rounded-2xl
        border
        border-slate-100
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Filtros
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <input
          type="text"
          value={bairro}
          onChange={(e) =>
            setBairro(e.target.value)
          }
          placeholder="Bairro"
          aria-label="Filtrar por bairro"
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            text-slate-700
            outline-none
            transition
            focus:border-[#1bb5d9]
            focus:ring-2
            focus:ring-sky-100
          "
        />

        <select
          value={hasAlerts}
          onChange={(e) =>
            setHasAlerts(e.target.value)
          }
          aria-label="Filtrar por situação dos alertas"
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            text-slate-700
            outline-none
            transition
            focus:border-[#1bb5d9]
            focus:ring-2
            focus:ring-sky-100
          "
        >
          <option value="">
            Situação dos Alertas
          </option>

          <option value="true">
            Com alertas
          </option>

          <option value="false">
            Sem alertas
          </option>
        </select>

        <select
          value={revisado}
          onChange={(e) =>
            setRevisado(e.target.value)
          }
          aria-label="Filtrar por status da revisão"
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            text-slate-700
            outline-none
            transition
            focus:border-[#1bb5d9]
            focus:ring-2
            focus:ring-sky-100
          "
        >
          <option value="">
            Status da Revisão
          </option>

          <option value="true">
            Revisado
          </option>

          <option value="false">
            Não revisado
          </option>
        </select>

        <select
          value={order}
          onChange={(e) =>
            setOrder(e.target.value)
          }
          aria-label="Selecionar campo de ordenação"
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            text-slate-700
            outline-none
            transition
            focus:border-[#1bb5d9]
            focus:ring-2
            focus:ring-sky-100
          "
        >
          <option value="">
            Ordenar por
          </option>

          <option value="nome">
            Nome
          </option>

          <option value="total_alertas">
            Quantidade de Alertas
          </option>
        </select>

        <button
          type="button"
          onClick={() =>
            setDirection(
              direction === "asc"
                ? "desc"
                : "asc"
            )
          }
          disabled={!order}
          aria-label={
            direction === "asc"
              ? "Ordenação crescente"
              : "Ordenação decrescente"
          }
          className={`
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            px-4
            py-3
            text-sm
            font-medium
            transition-all
            ${
              order
                ? `
                  border-slate-200
                  bg-white
                  text-slate-700
                  hover:border-[#1bb5d9]
                  hover:text-[#1bb5d9]
                `
                : `
                  cursor-not-allowed
                  border-slate-100
                  bg-slate-50
                  text-slate-400
                `
            }
          `}
        >
          <span
            aria-hidden="true"
            className="text-lg"
          >
            {direction === "asc"
              ? "↑"
              : "↓"}
          </span>

          <span>
            {direction === "asc"
              ? "Crescente"
              : "Decrescente"}
          </span>
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={clearFilters}
          aria-label="Limpar filtros"
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            px-5
            py-3
            text-sm
            font-medium
            text-slate-600
            transition
            hover:bg-slate-50
          "
        >
          Limpar filtros
        </button>

        <button
          type="button"
          onClick={applyFilters}
          aria-label="Aplicar filtros"
          className="
            rounded-xl
            bg-[#1bb5d9]
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            transition-all
            hover:bg-[#169fbe]
            active:scale-[0.98]
          "
        >
          Aplicar filtros
        </button>
      </div>
    </section>
  );
}