"use client";

import { FormEvent } from "react";

export default function Contact() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Transmission Sent. We will reply shortly.");
  };

  return (
    <section className="pt-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-tech font-bold text-white mb-2">
            INITIALIZE <span className="neon-text">CONNECTION</span>
          </h2>
          <p className="text-gray-400">Secure transmission channel open. Awaiting input.</p>
        </div>

        <div className="tech-panel p-8 neon-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-cyan-500 text-xs font-tech mb-2">IDENTIFIER (NAME)</label>
                <input type="text" required className="tech-input" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-cyan-500 text-xs font-tech mb-2">COMM LINK (EMAIL)</label>
                <input type="email" required className="tech-input" placeholder="john@domain.com" />
              </div>
            </div>
            <div>
              <label className="block text-cyan-500 text-xs font-tech mb-2">ENCRYPTED MESSAGE</label>
              <textarea required className="tech-input h-32 resize-none" placeholder="Enter query details..."></textarea>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-xs text-gray-500 font-tech hidden sm:inline-block">END-TO-END ENCRYPTED</span>
              <button type="submit" className="btn-neon btn-solid w-full sm:w-auto px-10 py-3">
                TRANSMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}