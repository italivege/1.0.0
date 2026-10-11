export default function Solutions() {
  return (
    <section className="pt-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-tech font-bold text-white mb-4">
          CORE <span className="neon-text">TECHNOLOGIES</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover our suite of advanced digital tools designed to optimize, secure, and scale your operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="tech-panel p-6 neon-border group cursor-pointer">
          <div className="w-12 h-12 mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-tech font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">AI SYSTEMS</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Advanced machine learning algorithms providing real-time data analysis and automated decision making.</p>
        </div>

        {/* Card 2 */}
        <div className="tech-panel p-6 neon-border group cursor-pointer">
          <div className="w-12 h-12 mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-tech font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">CLOUD ARCHITECTURE</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Decentralized cloud solutions ensuring maximum scalability, redundancy, and global accessibility.</p>
        </div>

        {/* Card 3 */}
        <div className="tech-panel p-6 neon-border group cursor-pointer">
          <div className="w-12 h-12 mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-tech font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">DATA SECURITY</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Military-grade encryption protocols and zero-trust network architectures protecting sensitive assets.</p>
        </div>

        {/* Card 4 */}
        <div className="tech-panel p-6 neon-border group cursor-pointer">
          <div className="w-12 h-12 mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-tech font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">NETWORK OPTIMIZATION</h3>
          <p className="text-gray-400 text-sm leading-relaxed">High-frequency data routing and edge computing capabilities reducing latency to theoretical minimums.</p>
        </div>
      </div>
    </section>
  );
}