import Link from "next/link";

export default function NotFound() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out_forwards] w-full pt-20 pb-20 flex justify-center items-center min-h-[65vh]">
      <div className="text-center tech-panel p-10 neon-border max-w-lg w-full">
        <h1 className="text-6xl font-[var(--font-orbitron)] font-bold text-red-500 mb-4 animate-pulse">404</h1>
        <h2 className="text-2xl font-[var(--font-orbitron)] font-bold text-white mb-4 uppercase">
          NODE <span className="neon-text">NOT FOUND</span>
        </h2>
        <p className="text-gray-400 mb-8 font-mono text-sm">
          The requested transmission path does not exist or access is restricted.
        </p>
        <Link href="/" className="btn-neon btn-solid py-3 px-8 text-sm">
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}