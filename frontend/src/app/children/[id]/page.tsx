import Link from "next/link";
import HealthCard from "@/components/HealthCard";
import EducationCard from "@/components/EducationCard";
import SocialCard from "@/components/SocialCard";
import ReviewButton from "@/components/ReviewButton";
import { cookies } from "next/headers";

import { getChild } from "@/lib/api";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ChildPage({
  params,
}: Props) {
  const { id } = await params;

  const token =
    (await cookies()).get("token")?.value ?? "";

  const child = await getChild(token, id);

  return (
    <main className="p-8">
      <Link href="/children">
        ← Voltar
      </Link>

      <h1 className="text-3xl font-bold mt-4">
        {child.nome}
      </h1>

      <div className="mt-6 border p-4">
        <h2 className="font-bold mb-2">
          Dados Gerais
        </h2>

        <p>
          <strong>Bairro:</strong>{" "}
          {child.bairro}
        </p>

        <p>
          <strong>Responsável:</strong>{" "}
          {child.responsavel}
        </p>

        <p>
          <strong>Data de nascimento:</strong>{" "}
          {new Date(
            child.data_nascimento
          ).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <HealthCard data={child.saude} />

        <EducationCard data={child.educacao} />

        <SocialCard
            data={child.assistencia_social}
        />
        </div>

      <div className="mt-6 border p-4">
        <h2 className="font-bold">
          Revisão
        </h2>

        <p>
          Status:{" "}
          {child.revisado
            ? "Revisado"
            : "Pendente"}
        </p>

        {child.revisado_por && (
          <p>
            Revisado por:{" "}
            {child.revisado_por}
          </p>
        )}

        {child.revisado_em && (
          <p>
            Em:{" "}
            {new Date(
              child.revisado_em
            ).toLocaleString("pt-BR")}
          </p>
        )}
      </div>

      <div className="mt-6 border p-4">
  <h2 className="font-bold">
    Revisão
  </h2>

  <p>
    Status:{" "}
    {child.revisado
      ? "Revisado"
      : "Pendente"}
  </p>

  {!child.revisado && (
    <ReviewButton childId={child.id} />
  )}
</div>
    </main>
  );
}