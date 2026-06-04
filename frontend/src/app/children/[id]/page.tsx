import Header from "@/components/Header";
import HealthCard from "@/components/HealthCard";
import EducationCard from "@/components/EducationCard";
import SocialCard from "@/components/SocialCard";
import ReviewButton from "@/components/ReviewButton";
import Link from "next/link";
import { getChild } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ChildPage({
  params,
}: Props) {
  const { id } = await params;

  const token = await requireAuth();

  const child = await getChild(token, id);

  return (
    <main className="min-h-screen bg-slate-100">
      <Header />

      <div className="max-w-7xl mx-auto p-8 space-y-6">

        <Link
          href="/children"
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Voltar para lista
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {child.nome}
              </h1>

              <p className="text-slate-500 mt-1">
                ID: {child.id}
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                child.revisado
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {child.revisado ? "Revisado" : "Pendente"}
            </div>
          </div>
        </div>

        {/* Dados gerais */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Dados Gerais
          </h2>

          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <p className="text-slate-500">Bairro</p>
              <p className="font-medium text-slate-900">
                {child.bairro}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Responsável</p>
              <p className="font-medium text-slate-900">
                {child.responsavel}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Data de nascimento
              </p>
              <p className="font-medium text-slate-900">
                {new Date(
                  child.data_nascimento
                ).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HealthCard data={child.saude} />
          <EducationCard data={child.educacao} />
          <SocialCard data={child.assistencia_social} />
        </div>

        {/* Review section */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Revisão do Caso
          </h2>

          <div className="space-y-2 text-sm text-slate-700">
            <p>
              Status:{" "}
              <span className="font-medium">
                {child.revisado ? "Revisado" : "Pendente"}
              </span>
            </p>

            {child.revisado_por && (
              <p>
                Revisado por:{" "}
                <span className="font-medium">
                  {child.revisado_por}
                </span>
              </p>
            )}

            {child.revisado_em && (
              <p>
                Em:{" "}
                <span className="font-medium">
                  {new Date(child.revisado_em).toLocaleString(
                    "pt-BR"
                  )}
                </span>
              </p>
            )}
          </div>

          {!child.revisado && (
            <div className="mt-6">
              <ReviewButton childId={child.id} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}