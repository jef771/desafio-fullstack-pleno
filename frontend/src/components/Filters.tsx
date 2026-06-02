"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Filters() {
  const router = useRouter();

  const [bairro, setBairro] = useState("");
  const [hasAlerts, setHasAlerts] = useState("");
  const [revisado, setRevisado] = useState("");

  function applyFilters() {
    const params = new URLSearchParams();

    if (bairro) {
      params.set("bairro", bairro);
    }

    if (hasAlerts) {
      params.set("has_alerts", hasAlerts);
    }

    if (revisado) {
      params.set("revisado", revisado);
    }

    params.set("page", "1");

    router.push(`/children?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 mb-6">
      <input
        className="border p-2"
        placeholder="Bairro"
        value={bairro}
        onChange={(e) => setBairro(e.target.value)}
      />

      <select
        className="border p-2"
        value={hasAlerts}
        onChange={(e) => setHasAlerts(e.target.value)}
      >
        <option value="">Alertas</option>
        <option value="true">Com alertas</option>
        <option value="false">Sem alertas</option>
      </select>

      <select
        className="border p-2"
        value={revisado}
        onChange={(e) => setRevisado(e.target.value)}
      >
        <option value="">Revisão</option>
        <option value="true">Revisado</option>
        <option value="false">Não revisado</option>
      </select>

      <button
        className="border px-4"
        onClick={applyFilters}
      >
        Filtrar
      </button>
    </div>
  );
}