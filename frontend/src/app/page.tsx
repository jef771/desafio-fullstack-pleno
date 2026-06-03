import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { getSummary } from "@/lib/api";
import AlertsChart from "@/components/AlertsChart";
import ReviewProgressChart from "@/components/ReviewProgressChart";
import Header from "@/components/Header";

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
      <Header />

      <div className="max-w-7xl mx-auto p-8">
        

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
            
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <AlertsChart
            data={summary.alerts_by_domain}
          />

          <ReviewProgressChart
            total={summary.total_of_children}
            reviewed={summary.already_reviewed}
          />
        </section>
      </div>
      
    </main>
    
  );
}