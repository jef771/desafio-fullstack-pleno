"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = {
  page: number;
  total: number;
  size: number;
};

export default function Pagination({
  page,
  total,
  size,
}: Props) {
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / size);

  function buildHref(newPage: number) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", String(newPage));

    return `/children?${params.toString()}`;
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className="
        mt-8
        flex
        flex-col
        gap-4
        rounded-2xl
        bg-white
        p-4
        shadow-sm
        border
        border-slate-100
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div className="text-sm text-slate-500">
        Página{" "}
        <span className="font-semibold text-slate-800">
          {page}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-slate-800">
          {totalPages}
        </span>
      </div>

      <div className="flex gap-3">
        {page > 1 && (
          <Link
            href={buildHref(page - 1)}
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-slate-700
              transition
              hover:border-[#1bb5d9]
              hover:text-[#1bb5d9]
            "
          >
            Anterior
          </Link>
        )}

        {page < totalPages && (
          <Link
            href={buildHref(page + 1)}
            className="
              rounded-xl
              bg-[#1bb5d9]
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#169fbe]
            "
          >
            Próxima
          </Link>
        )}
      </div>
    </div>
  );
}