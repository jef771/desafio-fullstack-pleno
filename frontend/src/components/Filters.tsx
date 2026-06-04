"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Filters() {
  const router = useRouter();

  const [bairro, setBairro] = useState("");
  const [hasAlerts, setHasAlerts] = useState("");
  const [revisado, setRevisado] = useState("");
  const [size, setSize] = useState("10");

  function applyFilters() {
    const params = new URLSearchParams();

    if (bairro) params.set("bairro", bairro);
    if (hasAlerts) params.set("has_alerts", hasAlerts);
    if (revisado) params.set("revisado", revisado);
    if (size) params.set("size", size);
    params.set("page", "1");

    router.push(`/children?${params.toString()}`);
  }

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Filtros
      </h2>

      <div className="grid gap-4 md:grid-cols-4">

        <input
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
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
            focus:ring-2 focus:ring-[#1bb5d9]/20
          "
        />

        <select
          value={hasAlerts}
          onChange={(e) => setHasAlerts(e.target.value)}
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
            focus:ring-2 focus:ring-[#1bb5d9]/20
          "
        >
          <option value="">Situação dos Alertas</option>
          <option value="true">Com alertas</option>
          <option value="false">Sem alertas</option>
        </select>

        <select
          value={revisado}
          onChange={(e) => setRevisado(e.target.value)}
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
            focus:ring-2 focus:ring-[#1bb5d9]/20
          "
        >
          <option value="">Status da Revisão</option>
          <option value="true">Revisado</option>
          <option value="false">Não revisado</option>
        </select>

        <button
          onClick={applyFilters}
          className="
            rounded-xl
            bg-[#1bb5d9]
            px-4 py-3
            text-sm font-semibold text-white
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