import Link from "next/link"

const Logo = ({ closeMenu, href = "/" }) => {
 return (
  <Link href={href} className="flex items-center group shrink-0" onClick={closeMenu}>
   <div className="flex justify-between items-center gap-2 sm:gap-4 lg:gap-6">
    <div className="relative inline-flex items-baseline leading-none group/logo">
     <span className="font-sans text-xl sm:text-2xl md:text-3xl font-black tracking-[0.16em] sm:tracking-[0.20em] md:tracking-[0.24em] bg-linear-to-br from-indigo-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(79,70,229,0.2)] transition-all duration-700 ease-out group-hover/logo:from-indigo-700 group-hover/logo:via-indigo-600 group-hover/logo:to-indigo-500 group-hover/logo:tracking-[0.19em] sm:group-hover/logo:tracking-[0.23em] md:group-hover/logo:tracking-[0.27em] group-hover/logo:drop-shadow-[0_4px_16px_rgba(79,70,229,0.3)] group-hover/logo:scale-[1.02] select-none origin-left">
      YAZICI
     </span>
     <span className="absolute left-full bottom-0.5 ml-1 sm:ml-1.5 font-sans text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.28em] sm:tracking-[0.34em] md:tracking-[0.40em] text-indigo-500/75 drop-shadow-sm transition-all duration-700 ease-out group-hover/logo:text-indigo-600 group-hover/logo:tracking-[0.32em] sm:group-hover/logo:tracking-[0.38em] md:group-hover/logo:tracking-[0.44em] group-hover/logo:ml-1.5 sm:group-hover/logo:ml-2 group-hover/logo:-translate-y-px select-none origin-bottom-left">
      TİCARET
     </span>
    </div>
   </div>
  </Link>
 )
}

export default Logo