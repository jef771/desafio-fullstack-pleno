"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const start =
    total === 0 ? 0 : (page - 1) * size + 1;

  const end = Math.min(
    page * size,
    total
  );

  function handleSizeChange(
    newSize: string
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("size", newSize);

    params.set("page", "1");

    router.push(
      `/children?${params.toString()}`
    );
  }

  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

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

      <div className="flex items-center gap-3">

        <select
          value={String(size)}
          onChange={(e) =>
            handleSizeChange(
              e.target.value
            )
          }
          className="
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-2
            text-sm
            text-slate-700
            outline-none
            transition
            focus:border-[#1bb5d9]
            focus:ring-2
            focus:ring-[#1bb5d9]/20
          "
        >
          <option value="10">
            10 por página
          </option>

          <option value="15">
            15 por página
          </option>

          <option value="20">
            20 por página
          </option>
        </select>

      </div>
    </div>
  );
}