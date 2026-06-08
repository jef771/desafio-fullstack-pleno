import Link from "next/link";

import { getChildren } from "@/lib/api";
import ChildrenFilters from "@/components/children/Filters";
import Pagination from "@/components/children/Pagination";
import Header from "@/components/Header";
import ResultsToolbar from "@/components/children/ResultsToolbar";
import { requireAuth } from "@/lib/auth";

type Props = {
  searchParams: Promise<{
    bairro?: string;
    has_alerts?: string;
    revisado?: string;
    order?: string;
    page?: string;
    size?: string;
    direction?: string;
  }>;
};

export default async function ChildrenPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const token = await requireAuth();

  const query = new URLSearchParams();

  query.set("page", params.page ?? "1");

  if (params.bairro) {
    query.set("bairro", params.bairro);
  }

  if (params.has_alerts) {
    query.set(
      "has_alerts",
      params.has_alerts
    );
  }

  if (params.revisado) {
    query.set(
      "revisado",
      params.revisado
    );
  }

  if (params.size) {
    query.set(
      "size",
       params.size
    );
  }

  if (params.order) {
    query.set("order", params.order);
  }

  if (params.direction) {
    query.set(
      "direction",
      params.direction
    );
  }

  const response = await getChildren(
    token,
    query
  );

  return (
    <main
      className="min-h-screen bg-slate-100"
      aria-label="Página de crianças monitoradas"
    >
      <Header />

      <div className="max-w-7xl mx-auto p-8">
        <section
          aria-labelledby="children-page-title"
          className="mb-8"
        >
          <h1
            id="children-page-title"
            className="text-2xl sm:text-3xl font-bold text-slate-900"
          >
            Crianças Monitoradas
          </h1>

          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Consulte registros, acompanhe alertas e revise casos pendentes.
          </p>
        </section>

        <section
          aria-labelledby="filters-title"
          className="mb-6"
        >
          <h2
            id="filters-title"
            className="sr-only"
          >
            Filtros de pesquisa
          </h2>

          <ChildrenFilters
            bairro={params.bairro ?? ""}
            hasAlerts={params.has_alerts ?? ""}
            revisado={params.revisado ?? ""}
            order={params.order ?? ""}
            direction={params.direction ?? ""}
          />
        </section>

        <section
          aria-labelledby="results-title"
        >
          <h2
            id="results-title"
            className="sr-only"
          >
            Resultados da pesquisa
          </h2>

          <div aria-live="polite">
            <ResultsToolbar
              page={response.page}
              size={response.size}
              total={response.total}
            />
          </div>

          {response.data.length === 0 && (
            <section
              className="
                mt-6
                flex
                min-h-[400px]
                items-center
                justify-center
                rounded-2xl
                bg-white
                shadow-sm
              "
              aria-live="polite"
              aria-label="Nenhum resultado encontrado"
            >
              <div className="text-center max-w-md px-6">
                <div
                  className="mb-4 text-6xl"
                  aria-hidden="true"
                >
                  🔍
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Nenhuma criança encontrada
                </h3>

                <p className="mt-3 text-slate-500">
                  Nenhum registro corresponde aos filtros selecionados.
                </p>

                <p className="mt-1 text-slate-500">
                  Tente remover alguns filtros ou alterar os critérios de busca.
                </p>
              </div>
            </section>
          )}

          <section
            aria-label="Lista de crianças"
            className="
              grid
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {response.data.map((child) => (
              <Link
                key={child.id}
                href={`/children/${child.id}?${query.toString()}`}
                aria-label={`Abrir detalhes de ${child.nome}`}
                className="
                  block
                  rounded-2xl
                  bg-white
                  p-5
                  shadow-sm
                  border
                  border-transparent
                  transition-all
                  hover:border-[#1bb5d9]
                  hover:shadow-md
                "
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {child.nome}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Responsável: {child.responsavel}
                    </p>
                  </div>

                  <span
                    aria-label={
                      child.revisado
                        ? "Caso revisado"
                        : "Caso pendente de revisão"
                    }
                    className={
                      child.revisado
                        ? `
                          rounded-full
                          bg-green-100
                          px-3
                          py-1
                          text-sm
                          font-medium
                          text-green-700
                        `
                        : `
                          rounded-full
                          bg-yellow-100
                          px-3
                          py-1
                          text-sm
                          font-medium
                          text-yellow-700
                        `
                    }
                  >
                    {child.revisado
                      ? "Revisado"
                      : "Pendente"}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase text-slate-400">
                      Bairro
                    </p>

                    <p className="font-medium text-slate-800">
                      {child.bairro}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-slate-400">
                      Data de nascimento
                    </p>

                    <p className="font-medium text-slate-800">
                      {new Date(
                        child.data_nascimento
                      ).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        aria-label={`${child.total_alertas} ${
                          child.total_alertas === 1
                            ? "alerta"
                            : "alertas"
                        }`}
                        className={`
                          inline-flex items-center justify-center
                          rounded-full
                          px-3 py-1
                          text-sm font-semibold
                          ${
                            child.total_alertas > 0
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }
                        `}
                      >
                        {child.total_alertas}{" "}
                        {child.total_alertas === 1
                          ? "alerta"
                          : "alertas"}
                      </span>
                    </div>

                    <div
                      aria-hidden="true"
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-sky-50
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-[#1bb5d9]
                      "
                    >
                      Ver detalhes →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </section>

        <Pagination
          page={response.page}
          size={response.size}
          total={response.total}
        />
      </div>
    </main>
  );
}