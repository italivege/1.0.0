export default function Services() {
  return (
    <section className="pt-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-tech font-bold text-white mb-4">OUR <span className="neon-text">SERVICES</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Comprehensive infrastructure and management solutions customized for enterprise-grade performance and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="tech-panel p-8 neon-border transition-transform hover:-translate-y-2">
          <h3 className="text-2xl font-tech font-bold text-cyan-400 mb-6">NETWORK INFRASTRUCTURE</h3>
          <ul className="text-gray-300 text-sm space-y-4 font-mono">
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-cyan-400 rounded-sm shadow-[0_0_8px_#00f3ff]"></div> 2-Tier Topology Architecture</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-cyan-400 rounded-sm shadow-[0_0_8px_#00f3ff]"></div> CCNA Standard Enterprise Routing</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-cyan-400 rounded-sm shadow-[0_0_8px_#00f3ff]"></div> Secure Subnet Isolation</li>
          </ul>
        </div>
        
        <div className="tech-panel p-8 neon-border transition-transform hover:-translate-y-2">
          <h3 className="text-2xl font-tech font-bold text-cyan-400 mb-6">CLOUD & SYSTEMS</h3>
          <ul className="text-gray-300 text-sm space-y-4 font-mono">
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-cyan-400 rounded-sm shadow-[0_0_8px_#00f3ff]"></div> AWS Managed Services</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-cyan-400 rounded-sm shadow-[0_0_8px_#00f3ff]"></div> High-Performance Rust Backends</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-cyan-400 rounded-sm shadow-[0_0_8px_#00f3ff]"></div> PostgreSQL Database Scaling</li>
          </ul>
        </div>

        <div className="tech-panel p-8 neon-border transition-transform hover:-translate-y-2">
          <h3 className="text-2xl font-tech font-bold text-cyan-400 mb-6">SECURITY AUDIT</h3>
          <ul className="text-gray-300 text-sm space-y-4 font-mono">
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-cyan-400 rounded-sm shadow-[0_0_8px_#00f3ff]"></div> Zero-Trust Configurations</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-cyan-400 rounded-sm shadow-[0_0_8px_#00f3ff]"></div> End-to-End Encryption Setup</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-cyan-400 rounded-sm shadow-[0_0_8px_#00f3ff]"></div> Traffic Monitoring & Logging</li>
          </ul>
        </div>
      </div>
    </section>
  );
}