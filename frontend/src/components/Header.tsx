import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-[var(--rio-blue)] text-white shadow">
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Image
            src="/images/Logo-Prefeitura-horizontal-branco.png"
            alt="Prefeitura do Rio"
            width={160}
            height={160}
          />

          <div>
            <h1 className="text-2xl font-bold">
              Painel de Monitoramento Infantil
            </h1>

            <p className="text-blue-100">
              Prefeitura do Rio de Janeiro
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="
              flex items-center gap-3
              rounded-xl
              bg-white
              px-5 py-3
              text-slate-800
              shadow-sm
              border border-transparent
              transition-all
              hover:border-[#1bb5d9]
              hover:text-[#1bb5d9]
              hover:shadow-md
            "
          >

            <span className="font-semibold">
              Dashboard
            </span>
          </Link>

          <Link
            href="/children"
            className="
              flex items-center gap-3
              rounded-xl
              bg-white
              px-5 py-3
              text-slate-800
              shadow-sm
              border border-transparent
              transition-all
              hover:border-[#1bb5d9]
              hover:text-[#1bb5d9]
              hover:shadow-md
            "
          >
            

            <span className="font-semibold">
              Crianças
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}