"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Globe, ShieldAlert } from "lucide-react";

export default function AboutModal({ isOpen, onClose, playSfx }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg p-1 border-2 border-cyber-cyan bg-black shadow-[0_0_50px_rgba(0,243,255,0.3)] clip-corner"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-cyber-cyan italic tracking-tighter uppercase">
                  Project_Amadeus
                </h2>
                <button
                  onClick={() => {
                    onClose();
                    playSfx("receive");
                  }}
                  className="text-cyber-magenta hover:scale-125 transition-transform"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/10">
                  <Cpu className="text-cyber-yellow mb-2" size={20} />
                  <div className="text-[10px] uppercase opacity-40">
                    Core_Engine
                  </div>
                  <div className="text-xs font-bold">Mistral_NLink_v4</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10">
                  <ShieldAlert className="text-cyber-magenta mb-2" size={20} />
                  <div className="text-[10px] uppercase opacity-40">
                    Security
                  </div>
                  <div className="text-xs font-bold">Encrypted_L4</div>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-white/70 font-mono">
                AMADEUS is a high-fidelity terminal interface designed for
                neural link synthesis. It exists within the local cache to
                ensure zero-latency communication between user and machine.
              </p>

              <div className="pt-4 border-t border-white/10 text-[9px] text-cyber-cyan/40 italic flex justify-between">
                <span>EST_2026_PROTOCOL</span>
                <span>STATUS: OPERATIONAL</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
