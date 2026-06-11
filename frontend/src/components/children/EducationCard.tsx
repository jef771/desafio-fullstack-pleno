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
      <div className="rounded-2xl border-l-4 border-blue-500 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Educação
        </h2>

        <p className="text-sm text-slate-500">
          Sem informações.
        </p>
      </div>
    );
  }

  const hasAlerts =
    data.alertas.length > 0;

  const attendance =
    data.frequencia_percent;

  return (
    <div className="rounded-2xl border-l-4 border-blue-500 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Educação
        </h2>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            hasAlerts
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {hasAlerts
            ? `${data.alertas.length} alerta${
                data.alertas.length > 1
                  ? "s"
                  : ""
              }`
            : "Sem alertas"}
        </span>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">
            Escola
          </span>

          <span className="text-right font-medium text-slate-900">
            {data.escola ??
              "Não matriculado"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">
            Frequência
          </span>

          <span
            className={`rounded-xl px-3 py-1 text-xs font-semibold ${
              attendance !== null &&
              attendance < 75
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {attendance !== null
              ? `${attendance}%`
              : "Sem informação"}
          </span>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Alertas identificados
          </p>

          {hasAlerts ? (
            <ul className="space-y-2">
              {data.alertas.map(
                (alerta, index) => (
                  <li
                    key={`${alerta}-${index}`}
                    className="
                      flex
                      items-start
                      gap-2
                      rounded-lg
                      bg-red-50
                      px-3
                      py-2
                      text-sm
                      text-red-700
                    "
                  >
                    

                    <span>{alerta}</span>
                  </li>
                )
              )}
            </ul>
          ) : (
            <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              Nenhum alerta registrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}