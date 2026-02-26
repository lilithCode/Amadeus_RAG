"use client";
import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

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
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    playSfx("send");
    setIsLoading(true);

    const userMsg = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Manage History Session
    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = Date.now();
      setActiveSessionId(sessionId);
      const newHistoryItem = {
        id: sessionId,
        name: userText.slice(0, 20) + (userText.length > 20 ? "..." : ""),
        data: [userMsg],
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    } else {
      setHistory((prev) =>
        prev.map((h) =>
          h.id === sessionId ? { ...h, data: [...h.data, userMsg] } : h,
        ),
      );
    }

    try {
      // FETCH FROM YOUR HUGGING FACE SPACE
       const response = await fetch("https://lillilith-neuraai.hf.space/chat", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ input: userText }), // Sends the user text to Hamza
       });

       const data = await response.json();
       const botReply = data.reply; // This is Hamza's response!

       playSfx("receive");
       setMessages((prev) => [
         ...prev,
         { role: "assistant", content: botReply },
       ]);

      // Update history session with bot reply
      setHistory((prev) =>
        prev.map((h) =>
          h.id === sessionId ? { ...h, data: [...h.data, botReply] } : h,
        ),
      );
    } catch (error) {
      console.error("Connection Error:", error);
      playSfx("receive");
      const errorMsg = {
        role: "assistant",
        content:
          "[SYSTEM_ERROR]: Neural link synchronization failed. Amadeus_Core is currently unreachable.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
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
        isLoading={isLoading}
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
