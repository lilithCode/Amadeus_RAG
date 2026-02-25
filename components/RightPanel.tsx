"use client";
import { motion } from "framer-motion";
import { History, Info, Code, Activity } from "lucide-react";

export default function RightPanel({
  playSfx,
  history,
  loadSession,
  openAbout,
  isPlaying,
}: any) {
  return (
    <aside className="w-72 flex flex-col gap-4 z-10">
      <div className="cyber-glass neon-border-magenta p-5 clip-cyber">
        <div className="flex items-center gap-2 text-[9px] font-black text-cyber-magenta opacity-60 uppercase mb-4 italic tracking-widest">
          <Activity size={12} /> signals
        </div>
        <div className="h-12 flex items-end gap-1 px-2">
          {[40, 80, 50, 95, 70, 85, 45, 60, 30, 50].map((h, i) => (
            <motion.div
              key={i}
              animate={
                isPlaying
                  ? { height: [`${h}%`, `${h - 40}%`, `${h}%`] }
                  : { height: "10%" }
              }
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
              className="flex-1 bg-cyber-magenta/80"
            />
          ))}
        </div>
      </div>

      <div className="flex-1 cyber-glass neon-border-cyan p-5 flex flex-col overflow-hidden clip-cyber">
        <div className="flex items-center gap-2 text-[10px] font-black text-cyber-cyan uppercase mb-6 border-b border-white/10 pb-2 italic tracking-widest">
          <History size={14} /> session_logs
        </div>
        <div className="space-y-2 overflow-y-auto scrollbar-hide">
          {history.map((h: any, i: number) => (
            <button
              key={i}
              onClick={() => {
                loadSession(h);
                playSfx("receive");
              }}
              className="w-full text-left text-[10px] font-bold text-white/40 hover:text-cyber-cyan hover:bg-white/5 p-2 border-l border-white/10 transition-all italic truncate"
            >
              {`> ${h.name}`}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          openAbout();
          playSfx("send");
        }}
        className="cyber-glass border border-white/20 p-4 flex justify-between items-center group hover:bg-cyber-cyan/10 transition-all"
      >
        <span className="text-[10px] font-black uppercase text-white/60 group-hover:text-white">
          System_Info
        </span>
        <Info size={16} className="text-cyber-cyan" />
      </button>

      <button className="bg-cyber-yellow p-4 text-black font-black uppercase text-[10px] flex justify-between items-center px-6 hover:brightness-125 transition-all">
        Source_Code <Code size={16} />
      </button>
    </aside>
  );
}
