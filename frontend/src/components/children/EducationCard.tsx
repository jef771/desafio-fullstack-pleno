type Props = {
  data: {
    escola: string | null;
    frequencia_percent: number | null;
    alertas: string[];
  } | null;
};

export default function EducationCard({ data }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border-l-4 border-blue-500">

      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Educação
      </h2>

      {!data ? (
        <p className="text-sm text-slate-500">
          Sem informações.
        </p>
      ) : (
        <div className="space-y-4 text-sm">

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Escola
            </span>

            <span className="font-medium text-slate-900 text-right">
              {data.escola ?? "Não matriculado"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Frequência
            </span>

            <span className="font-semibold text-slate-900">
              {data.frequencia_percent ?? "-"}%
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