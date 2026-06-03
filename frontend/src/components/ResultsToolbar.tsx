type Props = {
  page: number;
  size: number;
  total: number;
};

export default function ResultsToolbar({
  page,
  size,
  total,
}: Props) {
  const start = total === 0 ? 0 : (page - 1) * size + 1;

  const end = Math.min(page * size, total);

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      {/* Left: range info */}
      <div className="inline-flex items-center rounded-xl bg-white px-5 py-3 shadow-sm border border-slate-100">
        <span className="text-slate-500">
          Mostrando
        </span>

        <span className="mx-2 font-semibold text-slate-800">
          {start}-{end}
        </span>

        <span className="text-slate-500">
          de
        </span>

        <span className="mx-2 font-bold text-slate-900">
          {total}
        </span>

        <span className="text-slate-500">
          resultados
        </span>
      </div>

      {/* Right: optional future controls */}
      <div className="text-sm text-slate-500">
        Página {page}
      </div>
    </div>
  );
}