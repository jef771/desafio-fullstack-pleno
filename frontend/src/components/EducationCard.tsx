type Props = {
  data: {
    escola: string | null;
    frequencia_percent: number | null;
    alertas: string[];
  } | null;
};

export default function EducationCard({
  data,
}: Props) {
  if (!data) {
    return (
      <div className="border p-4 rounded">
        <h2 className="font-bold mb-2">
          Educação
        </h2>

        <p>Sem informações.</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded">
      <h2 className="font-bold mb-2">
        Educação
      </h2>

      <p>
        Escola:{" "}
        {data.escola ?? "Não matriculado"}
      </p>

      <p>
        Frequência:{" "}
        {data.frequencia_percent ?? "-"}%
      </p>

      <p>
        Alertas: {data.alertas.length}
      </p>
    </div>
  );
}