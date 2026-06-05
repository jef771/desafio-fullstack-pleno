import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { getSummary } from "@/lib/api";
import AlertsChart from "@/components/dashboard/AlertsChart";
import ReviewProgressChart from "@/components/dashboard/ReviewProgressChart";
import Header from "@/components/Header";
import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const token = await requireAuth();
  
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
        

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Dashboard de Monitoramento
          </h1>

          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Visão geral dos registros, revisões e alertas do sistema municipal.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">

          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border-l-4 border-slate-400">
            <p className="text-sm text-slate-500">
              Total de Crianças
            </p>

            <p className="mt-3 text-4xl sm:text-5xl font-bold text-slate-900">
              {summary.total_of_children}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-slate-500">
              Casos Revisados
            </p>

            <p className="mt-3 text-4xl sm:text-5xl font-bold text-green-600">
              {summary.already_reviewed}
            </p>

            <div className="absolute right-4 top-4 text-green-100 text-4xl">
              ✓
            </div>
          </div>
        </section>

      <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Alertas por área
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {summary.alerts_by_domain.map((domain) => {
              const configMap = {
                saude: {
                  title: "Saúde",
                  border: "border-red-500",
                },
                educacao: {
                  title: "Educação",
                  border: "border-blue-500",
                },
                assistencia_social: {
                  title: "Assistência Social",
                  border: "border-emerald-500",
                },
              } as const;

              const config =
                configMap[domain.domain_name as keyof typeof configMap];

              return (
                <div
                  key={domain.domain_name}
                  className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border-l-4 ${config.border}`}
                >
                  <p className="text-sm text-slate-500">
                    {config.title}
                  </p>

                  <p className="mt-3 text-4xl font-bold text-slate-900">
                    {domain.total}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    alertas registrados
                  </p>

                </div>
              );
            })}
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