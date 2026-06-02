import Link from "next/link";

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
  const totalPages = Math.ceil(total / size);

  return (
    <div className="flex gap-4 mt-6">
      {page > 1 && (
        <Link href={`/children?page=${page - 1}`}>
          Anterior
        </Link>
      )}

      <span>
        Página {page} de {totalPages}
      </span>

      {page < totalPages && (
        <Link href={`/children?page=${page + 1}`}>
          Próxima
        </Link>
      )}
    </div>
  );
}