import { cookies } from "next/headers";
import { getSummary } from "@/lib/api";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Missing token");
  }

  const summary = await getSummary(token);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Painel de Monitoramento
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded p-4">
          <h2 className="font-semibold">
            Total de Crianças
          </h2>

          <p className="text-4xl">
            {summary.total_of_children}
          </p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">
            Casos Revisados
          </h2>

          <p className="text-4xl">
            {summary.already_reviewed}
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          Alertas por Área
        </h2>

        <ul className="space-y-2">
          {summary.alerts_by_domain.map(
            (domain) => (
              <li
                key={domain.domain_name}
                className="border rounded p-3"
              >
                <strong>
                  {domain.domain_name}
                </strong>
                : {domain.total}
              </li>
            )
          )}
        </ul>
      </section>
    </main>
  );
}