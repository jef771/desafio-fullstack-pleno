import Link from "next/link";
import Image from "next/image";
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

  const colors: Record<string, string> = {
    health: "border-l-red-500",
    education: "border-l-blue-500",
    social_assistance: "border-l-green-500",
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-[var(--rio-blue)] text-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center gap-6">
  <Image
    src="/images/Logo-Prefeitura-horizontal-branco.png"
    alt="Prefeitura do Rio"
    width={160}
    height={160}
  />

  <div>
    <h1 className="text-2xl font-bold">
      Painel de Monitoramento Infantil
    </h1>

    <p className="mt-1 text-blue-100">
      Prefeitura do Rio de Janeiro
    </p>
  </div>
</div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        <Link
              href="/children"
              className="
                group
                flex
                flex-col
                mb-6
                items-center
                justify-center
                text-center
                w-56
                p-6
                rounded-2xl
                bg-gray-100
                border
                border-transparent
                shadow-sm
                transition-all
                hover:border-[#1bb5d9]
                hover:shadow-md
              "
            >
              <Image
                src="/images/consulta.png"
                alt="Consulta"
                width={60}
                height={60}
                className="mx-auto"
              />

              <span
                className="
                  mt-3
                  text-lg
                  text-slate-800
                  transition-all
                  group-hover:font-bold
                "
              >
                Ver Crianças
              </span>
          </Link>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-700">
              Total de Crianças
            </h2>

            <p className="mt-4 text-6xl font-bold text-slate-900">
              {summary.total_of_children}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-700">
              Casos Revisados
            </h2>

            <p className="mt-4 text-6xl font-bold text-green-600">
              {summary.already_reviewed}
            </p>
          </div>
      </section>

        <section className="mt-10">
          <div className="grid gap-6 md:grid-cols-3">
            {summary.alerts_by_domain.map(
              (domain) => {
                const title =
                  domain.domain_name === "saude"
                    ? "Saúde"
                    : domain.domain_name ===
                        "educacao"
                      ? "Educação"
                      : "Assistência Social";

                return (
                  <div
                    key={domain.domain_name}
                    className="rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition"
                  >

                    <h3 className="text-xl font-semibold text-slate-800">
                      {title}
                    </h3>

                    <p className="mt-4 text-5xl font-bold text-slate-900">
                      {domain.total}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      alertas registrados
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </div>
      
    </main>
    
  );
}