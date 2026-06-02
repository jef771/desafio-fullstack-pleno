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

      <div className="mb-4">
        Total encontrado: {response.total}
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Nome</th>
            <th className="border p-2">Bairro</th>
            <th className="border p-2">
              Responsável
            </th>
            <th className="border p-2">
              Revisado
            </th>
            <th className="border p-2">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {response.data.map((child) => (
            <tr key={child.id}>
              <td className="border p-2">
                {child.nome}
              </td>

              <td className="border p-2">
                {child.bairro}
              </td>

              <td className="border p-2">
                {child.responsavel}
              </td>

              <td className="border p-2">
                {child.revisado
                  ? "Sim"
                  : "Não"}
              </td>

              <td className="border p-2">
                <Link
                  href={`/children/${child.id}`}
                >
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={response.page}
        size={response.size}
        total={response.total}
      />
    </main>
  );
}