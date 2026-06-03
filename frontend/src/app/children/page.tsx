import Link from "next/link";
import { cookies } from "next/headers";

import { getChildren } from "@/lib/api";
import ChildrenFilters from "@/components/Filters";
import Pagination from "@/components/Pagination";

type Props = {
  searchParams: Promise<{
    bairro?: string;
    has_alerts?: string;
    revisado?: string;
    page?: string;
  }>;
};

export default async function ChildrenPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const token =
    (await cookies()).get("token")?.value ?? "";

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

  const response = await getChildren(
    token,
    query
  );

  console.log(response);

  return (
    <main className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Crianças
        </h1>

        <Link href="/">
          Voltar ao Dashboard
        </Link>
      </div>

      <ChildrenFilters />

      <div className="mb-6">
        <div className="inline-flex items-center rounded-xl bg-white px-5 py-3 shadow-sm">
          <span className="text-slate-500 mr-2">
            Total encontrado:
          </span>

          <span className="text-xl font-bold">
            {response.total}
          </span>
        </div>
      </div>

      <section
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
            href={`/children/${child.id}`}
            className="
              block
              rounded-2xl
              bg-gray-100
              p-5
              shadow-sm
              border
              border-transparent
              transition-all
              hover:border-[#1bb5d9]
              hover:shadow-md
            "
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {child.nome}
                </h2>

                <p className="text-sm text-slate-500">
                  Responsável: {child.responsavel}
                </p>
              </div>

              <span
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

                <p className="font-medium">
                  {child.bairro}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-400">
                  Data de nascimento
                </p>

                <p className="font-medium">
                  {new Date(
                    child.data_nascimento
                  ).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-[#1bb5d9] font-medium">
              Ver detalhes →
            </div>
          </Link>
        ))}
      </section>

      <Pagination
        page={response.page}
        size={response.size}
        total={response.total}
      />
    </main>
  );
}