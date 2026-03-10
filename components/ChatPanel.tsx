"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Terminal, Send } from "lucide-react";

export default function ChatPanel({
  messages,
  input,
  setInput,
  handleSend,
  startNewChat,
  isLoading,
}: any) {
  return (
    <section className="flex-1 flex flex-col cyber-panel neon-border-cyan z-20 overflow-hidden clip-chamfer">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-cyber-cyan rounded-full p-0.5">
            <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden">
              <img
                src="/profile.jpg"
                className="w-full h-full object-cover opacity-80"
                alt="profile"
              />
            </div>
          </div>
          <span className="font-black italic text-sm tracking-tighter text-cyber-cyan">
            AMADEUS_Senpai
          </span>
        </div>
        <button
          onClick={startNewChat}
          className="p-2 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/20 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-cyber">
        <AnimatePresence mode="popLayout">
          {messages.map((msg: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-6 py-4 max-w-[85%] text-sm font-medium tracking-wide shadow-xl ${
                  msg.role === "user"
                    ? "bg-cyber-magenta/20 text-white clip-msg-user border-r-2 border-cyber-magenta"
                    : "bg-cyber-cyan/15 text-white clip-msg-bot border-l-2 border-cyber-cyan"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="bg-cyber-cyan/10 text-cyber-cyan clip-msg-bot border-l-2 border-cyber-cyan px-6 py-4 flex flex-col gap-2">
                
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: dot * 0.2,
                      }}
                      className="w-1.5 h-1.5 bg-cyber-cyan shadow-[0_0_5px_#00f3ff]"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-black/40 border-t border-white/10 flex gap-3">
        <div className="flex-1 relative flex items-center bg-white/5 border border-white/10 clip-chamfer px-4">
          <Terminal className="text-cyber-yellow" size={16} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              isLoading ? "NEURAL_LINK_BUSY..." : "TYPE_MESSAGE_HERE..."
            }
            disabled={isLoading}
            className="w-full p-3 bg-transparent text-white outline-none font-mono text-xs italic disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-cyber-cyan text-black px-8 font-black uppercase text-[10px] clip-chamfer hover:bg-white transition-all flex items-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          {isLoading ? "WAIT" : "SEND"} <Send size={12} />
        </button>
      </div>
    </section>
  );
}
