import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-[var(--rio-blue)] text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Image
              src="/images/Logo-Prefeitura-horizontal-branco.png"
              alt="Prefeitura do Rio"
              width={140}
              height={140}
              className="w-auto h-10 sm:h-12"
            />

            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                Painel de Monitoramento Infantil
              </h1>

              <p className="text-blue-100 text-xs sm:text-sm truncate">
                Prefeitura do Rio de Janeiro
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap lg:flex-nowrap gap-2 sm:gap-3">
            
            <Link
              href="/"
              className="
                whitespace-nowrap
                flex items-center justify-center
                rounded-lg sm:rounded-xl
                bg-white
                px-3 sm:px-4 lg:px-5
                py-2 sm:py-3
                text-slate-800
                text-sm sm:text-base
                shadow-sm
                transition-all
                hover:text-[#1bb5d9]
                hover:shadow-md
              "
            >
              Dashboard
            </Link>

            <Link
              href="/children"
              className="
                whitespace-nowrap
                flex items-center justify-center
                rounded-lg sm:rounded-xl
                bg-white
                px-3 sm:px-4 lg:px-5
                py-2 sm:py-3
                text-slate-800
                text-sm sm:text-base
                shadow-sm
                transition-all
                hover:text-[#1bb5d9]
                hover:shadow-md
              "
            >
              Crianças
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}