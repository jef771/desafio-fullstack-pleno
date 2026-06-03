type Props = {
  data: {
    cad_unico: boolean;
    beneficio_ativo: boolean;
    alertas: string[];
  } | null;
};

export default function SocialCard({ data }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border-l-4 border-green-500">

      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Assistência Social
      </h2>

      {!data ? (
        <p className="text-sm text-slate-500">
          Sem informações.
        </p>
      ) : (
        <div className="space-y-4 text-sm">

          {/* CadÚnico */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              CadÚnico
            </span>

            <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              data.cad_unico
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}>
              {data.cad_unico ? "Sim" : "Não"}
            </span>
          </div>

          {/* Benefício */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Benefício ativo
            </span>

            <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              data.beneficio_ativo
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}>
              {data.beneficio_ativo ? "Sim" : "Não"}
            </span>
          </div>

          {/* Alertas */}
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