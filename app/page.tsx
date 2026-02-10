
import RiskVisualizer from "@/components/RiskVisualizer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-24">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block px-3 py-1 mb-4 border border-indigo-500/30 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono">
            SYSTEM STATUS: ONLINE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            AI Gov<br/>Protocol
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-md">
            Automatisierte Compliance-Überwachung. Powered by Google Gemini 2.0 Flash.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition">
                Start Gemini Audit
            </button>
          </div>
        </div>
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <RiskVisualizer />
        </div>
      </div>
    </main>
  );
}