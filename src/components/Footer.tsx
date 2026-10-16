import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/20 bg-[#02050a] py-8 relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-[var(--font-orbitron)] text-xl text-white">
          italive<span className="text-cyan-400">.ge</span>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Privacy Protocol</Link>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
        </div>
        <div className="text-gray-600 text-xs font-[var(--font-orbitron)]">
          &copy; 2026 ITALIVE.GE. ALL SYSTEMS ALIVE.
        </div>
      </div>
    </footer>
  );
}