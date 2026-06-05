"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  bairro: string;
  hasAlerts: string;
  revisado: string;
  order: string;
};

export default function Filters({
  bairro: initialBairro,
  hasAlerts: initialHasAlerts,
  revisado: initialRevisado,
  order: initialOrder,
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

  function clearFilters() {
    setBairro("");
    setHasAlerts("");
    setRevisado("");
    setOrder("");
  }

  function applyFilters() {
    const params = new URLSearchParams();

    if (bairro) params.set("bairro", bairro);

    if (hasAlerts) {
      params.set("has_alerts", hasAlerts);
    }

    if (revisado) {
      params.set("revisado", revisado);
    }

    if (order) {
      params.set("order", order);
    }

    params.set("page", "1");
    

    router.push(`/children?${params.toString()}`);
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-slate-800">
        Filtros
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          value={bairro}
          onChange={(e) =>
            setBairro(e.target.value)
          }
          placeholder="Bairro"
          className="
            w-full
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-3
            text-sm text-slate-700
            outline-none
            transition
            focus:border-[#1bb5d9]
            focus:ring-2
            focus:ring-[#1bb5d9]/20
          "
        />

        <select
          value={hasAlerts}
          onChange={(e) =>
            setHasAlerts(e.target.value)
          }
          className="
            w-full
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-3
            text-sm text-slate-700
            outline-none
            transition
            focus:border-[#1bb5d9]
            focus:ring-2
            focus:ring-[#1bb5d9]/20
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
          className="
            w-full
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-3
            text-sm text-slate-700
            outline-none
            transition
            focus:border-[#1bb5d9]
            focus:ring-2
            focus:ring-[#1bb5d9]/20
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
          className="
            w-full
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-3
            text-sm text-slate-700
            outline-none
            transition
            focus:border-[#1bb5d9]
            focus:ring-2
            focus:ring-[#1bb5d9]/20
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
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={clearFilters}
          className="
            rounded-xl
            border border-slate-200
            bg-white
            px-5 py-3
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
          className="
            rounded-xl
            bg-[#1bb5d9]
            px-6 py-3
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
    </div>
  );
}