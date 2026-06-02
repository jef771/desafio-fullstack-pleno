type Props = {
  data: {
    ultima_consulta: string;
    vacinas_em_dia: boolean;
    alertas: string[];
  } | null;
};

export default function HealthCard({
  data,
}: Props) {
  if (!data) {
    return (
      <div className="border p-4 rounded">
        <h2 className="font-bold mb-2">
          Saúde
        </h2>

        <p>Sem informações.</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded">
      <h2 className="font-bold mb-2">
        Saúde
      </h2>

      <p>
        Vacinas em dia:{" "}
        {data.vacinas_em_dia ? "Sim" : "Não"}
      </p>

      <p>
        Última consulta:{" "}
        {new Date(
          data.ultima_consulta
        ).toLocaleDateString("pt-BR")}
      </p>

      <p>
        Alertas: {data.alertas.length}
      </p>
    </div>
  );
}