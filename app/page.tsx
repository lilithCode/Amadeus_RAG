"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import CyberCursor from "@/components/CyberCursor";
import LoadingScreen from "@/components/LoadingScreen";
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
      const timer = setTimeout(() => setBootProgress((p) => p + 4), 30);
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input;
    const userMsg = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    playSfx("send");
    setIsLoading(true);

    try {
      const historyToSend = [...messages, userMsg];
     const response = await fetch("/api/chat", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ messages: historyToSend }),
     });
      const data = await response.json();
      playSfx("receive");
      const assistantMsg = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMsg]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "[SYSTEM_ERROR]: Lost Link." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative h-screen w-screen bg-[#050508] overflow-hidden font-mono">
      <CyberCursor />

      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('/background.png')",
          filter: "brightness(0.5)",
        }}
      />

      <AnimatePresence mode="wait">
        {!isInitialized ? (
          <LoadingScreen
            key="loader"
            progress={bootProgress}
            onInitialize={initializeSystem}
          />
        ) : (
          <div key="app" className="relative z-10 flex h-full w-full gap-4 p-4">
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
              isLoading={isLoading}
            />
            <RightPanel
              isPlaying={isPlaying}
              history={history}
              loadSession={(s: any) => {
                setMessages(s.data);
                setActiveSessionId(s.id);
              }}
              openAbout={() => setShowAbout(true)}
              playSfx={playSfx}
            />
          </div>
        )}
      </AnimatePresence>

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        playSfx={playSfx}
      />
    </main>
  );
}
