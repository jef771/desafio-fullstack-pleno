type Props = {
  data: {
    cad_unico: boolean;
    beneficio_ativo: boolean;
    alertas: string[];
  } | null;
};

export default function SocialCard({
  data,
}: Props) {
  if (!data) {
    return (
      <div className="border p-4 rounded">
        <h2 className="font-bold mb-2">
          Assistência Social
        </h2>

        <p>Sem informações.</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded">
      <h2 className="font-bold mb-2">
        Assistência Social
      </h2>

      <p>
        CadÚnico:{" "}
        {data.cad_unico ? "Sim" : "Não"}
      </p>

      <p>
        Benefício ativo:{" "}
        {data.beneficio_ativo
          ? "Sim"
          : "Não"}
      </p>

      <p>
        Alertas: {data.alertas.length}
      </p>
    </div>
  );
}