"use client";
import { useState, useRef, useEffect } from "react";
import CyberCursor from "@/components/CyberCursor";
import LeftPanel from "@/components/LeftPanel";
import ChatPanel from "@/components/ChatPanel";
import RightPanel from "@/components/RightPanel";
import AboutModal from "@/components/AboutModal";

export default function Home() {
  const [bootProgress, setBootProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showAbout, setShowAbout] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (bootProgress < 100) {
      const timer = setTimeout(() => setBootProgress((p) => p + 5), 30);
      return () => clearTimeout(timer);
    }
  }, [bootProgress]);

  const initializeSystem = () => {
    setIsInitialized(true);
    setIsPlaying(true);
    playSfx("receive");
  };

  const playSfx = (type: string) => {
    const audio = new Audio(`/sfx/${type}.mp3`);
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };


  // CHAT & HISTORY LOGIC 
  const handleSend = () => {
    if (!input.trim()) return;

    playSfx("send");
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = Date.now();
      setActiveSessionId(sessionId);
      const newHistoryItem = {
        id: sessionId,
        name: input.slice(0, 20) + (input.length > 20 ? "..." : ""),
        data: newMessages,
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    } else {
      setHistory((prev) =>
        prev.map((h) =>
          h.id === sessionId ? { ...h, data: [...h.data, userMsg] } : h,
        ),
      );
    }

    setTimeout(() => {
      playSfx("receive");
      const botMsg = {
        role: "assistant",
        content: `[LOG]: Signal synchronized. Processing request: "${input.slice(0, 10)}..."`,
      };
      setMessages((prev) => [...prev, botMsg]);

      // Update history 
      setHistory((prev) =>
        prev.map((h) =>
          h.id === sessionId ? { ...h, data: [...h.data, botMsg] } : h,
        ),
      );
    }, 1000);
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveSessionId(null);
    playSfx("send");
  };

  const loadSession = (session: any) => {
    setMessages(session.data);
    setActiveSessionId(session.id);
    playSfx("receive");
  };

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center font-mono">
        <div className="w-80 h-1 bg-zinc-900 border border-white/10 mb-6 overflow-hidden">
          <div
            className="h-full bg-cyber-cyan shadow-[0_0_15px_#00f3ff]"
            style={{ width: `${bootProgress}%` }}
          />
        </div>
        {bootProgress >= 100 ? (
          <button
            onClick={initializeSystem}
            className="px-8 py-3 border-2 border-cyber-cyan text-cyber-cyan animate-pulse hover:bg-cyber-cyan hover:text-black transition-all font-black"
          >
            INITIALIZE_NEURAL_LINK
          </button>
        ) : (
          <div className="text-cyber-cyan text-xs tracking-[0.5em] animate-pulse">
            AMADEUS_BOOTING... {bootProgress}%
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="relative h-screen w-screen p-4 flex gap-4 bg-[#050508] overflow-hidden">
      <CyberCursor />

      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url('/background.png')",
          filter: "brightness(0.5)",
        }}
      />

      <LeftPanel
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTrack={currentTrack}
        setCurrentTrack={setCurrentTrack}
        playSfx={playSfx}
      />

      <ChatPanel
        messages={messages}
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        startNewChat={startNewChat}
        playSfx={playSfx}
      />

      <RightPanel
        isPlaying={isPlaying}
        history={history}
        loadSession={loadSession}
        openAbout={() => setShowAbout(true)}
        playSfx={playSfx}
      />

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        playSfx={playSfx}
      />
    </main>
  );
}
