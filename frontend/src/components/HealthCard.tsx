type Props = {
  data: {
    ultima_consulta: string;
    vacinas_em_dia: boolean;
    alertas: string[];
  } | null;
};

export default function HealthCard({ data }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border-l-4 border-red-500">

      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Saúde
      </h2>

      {!data ? (
        <p className="text-sm text-slate-500">
          Sem informações.
        </p>
      ) : (
        <div className="space-y-4 text-sm">

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Vacinas em dia
            </span>

            <span
              className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                data.vacinas_em_dia
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {data.vacinas_em_dia ? "Sim" : "Atenção"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Última consulta
            </span>

            <span className="font-medium text-slate-900">
              {new Date(
                data.ultima_consulta
              ).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Alertas
            </span>

            <span className="font-semibold text-slate-900">
              {data.alertas.length}
            </span>
          </div>

        </div>
      )}
    </div>
  );
}