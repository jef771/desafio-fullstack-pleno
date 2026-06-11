import Header from "@/components/Header";
import HealthCard from "@/components/children/HealthCard";
import EducationCard from "@/components/children/EducationCard";
import SocialCard from "@/components/children/SocialCard";
import ReviewButton from "@/components/children/ReviewButton";
import Link from "next/link";
import { getChild } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    bairro?: string;
    has_alerts?: string;
    revisado?: string;
    order?: string;
    size?: string;
    page?: string;
  }>;
};

export default async function ChildPage({
  params,
  searchParams
}: Props) {
  const { id } = await params;

  const token = await requireAuth();

  const child = await getChild(token, id);

  const filters = await searchParams;

  const backParams = new URLSearchParams();

  Object.entries(filters).forEach(
    ([key, value]) => {
      if (value) {
        backParams.set(key, value);
      }
    }
  );

  const backUrl =
    backParams.toString().length > 0
      ? `/children?${backParams.toString()}`
      : "/children";

  return (
    <main
      className="min-h-screen bg-slate-100"
      aria-label={`Detalhes da criança ${child.nome}`}
    >
      <Header />

      <div className="max-w-7xl mx-auto p-8 space-y-6">

        <Link
          href={backUrl}
          aria-label="Voltar para a lista de crianças"
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-5
            py-3
            text-sm
            font-semibold
            text-slate-700
            shadow-sm
            transition-all
            hover:border-[#1bb5d9]
            hover:text-[#1bb5d9]
            hover:shadow-md
            active:scale-[0.98]
          "
        >
          ← Voltar para lista
        </Link>

        <section
          aria-labelledby="child-name"
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <div className="flex items-start justify-between gap-6">

            <div>
              <h1
                id="child-name"
                className="text-2xl font-bold text-slate-900"
              >
                {child.nome}
              </h1>

              <p className="text-slate-500 mt-1">
                ID: {child.id}
              </p>
            </div>

            <div
              aria-label={
                child.revisado
                  ? "Caso revisado"
                  : "Caso pendente de revisão"
              }
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                child.revisado
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {child.revisado ? "Revisado" : "Pendente"}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="dados-gerais"
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <h2
            id="dados-gerais"
            className="text-lg font-semibold text-slate-800 mb-4"
          >
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
        </section>

        <section
          aria-labelledby="dominios-monitoramento"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <h2
            id="dominios-monitoramento"
            className="sr-only"
          >
            Informações de saúde, educação e assistência social
          </h2>

          <HealthCard data={child.saude} />
          <EducationCard data={child.educacao} />
          <SocialCard data={child.assistencia_social} />
        </section>

        <section
          aria-labelledby="revisao-caso"
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <h2
            id="revisao-caso"
            className="text-lg font-semibold text-slate-800 mb-4"
          >
            Revisão do Caso
          </h2>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>
              Status:{" "}
              <span className="font-medium">
                {child.revisado
                  ? "Revisado"
                  : "Pendente"}
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
                  {new Date(
                    child.revisado_em
                  ).toLocaleString("pt-BR")}
                </span>
              </p>
            )}

            {!child.revisado && (
            <div
              className="mt-6"
              aria-label="Ações de revisão"
            >
              <ReviewButton childId={child.id} />
            </div>
          )}
          </div>

        
        </section>
      </div>
    </main>
  );
}