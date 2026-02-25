"use client";
import React, { useEffect, useRef } from "react";
import { Play, Pause, Disc } from "lucide-react";
import { TRACKS } from "./playlistData";

export default function LeftPanel({
  isPlaying,
  setIsPlaying,
  currentTrack,
  setCurrentTrack,
  playSfx,
}: any) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = `/sfx/Playlist/${TRACKS[currentTrack].file}`;
    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentTrack]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
    if (playSfx) playSfx("send");
  };

  return (
    <aside className="w-80 flex flex-col gap-4 z-10">
      <div className="flex-1 cyber-glass neon-border-cyan clip-cyber p-6 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-10 border-b border-cyber-cyan/20 pb-2">
          <Disc
            className={`text-cyber-cyan ${isPlaying ? "animate-spin" : ""}`}
            size={14}
          />
          <h3 className="text-[9px] text-cyber-cyan font-black tracking-[0.4em] uppercase italic">
            Audio_Space
          </h3>
        </div>

        <div
          className="relative mb-12 cursor-pointer group"
          onClick={togglePlay}
        >
          <div
            className={`w-56 h-56 rounded-full border-2 border-white/20 shadow-[0_0_60px_rgba(0,243,255,0.2)] overflow-hidden relative ${isPlaying ? "animate-spin-slow" : ""}`}
          >
            <img
              src={TRACKS[currentTrack].cover}
              className="w-full h-full object-cover block absolute inset-0"
              alt="cover"
              style={{ objectPosition: "center" }}
            />
            {/* Vinyl Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />

            {/* Center Hole */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 bg-black border border-cyber-cyan  rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-cyber-cyan rounded-full shadow-[0_0_10px_#00f3ff]" />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-2 -right-2 p-4 bg-cyber-cyan text-black rounded-full shadow-[0_0_30px_#00f3ff] group-hover:scale-110 transition-transform z-20">
            {isPlaying ? (
              <Pause size={22} fill="black" />
            ) : (
              <Play size={22} fill="black" />
            )}
          </div>
        </div>

        <div className="w-full space-y-1 overflow-y-auto pr-1 scrollbar-hide">
          {TRACKS.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentTrack(i);
                setIsPlaying(true);
                if (playSfx) playSfx("send");
              }}
              className={`w-full text-left text-[10px] font-bold p-3 transition-all flex items-center gap-3 ${
                currentTrack === i
                  ? "text-cyber-cyan bg-cyber-cyan/10 border-l-2 border-cyber-cyan"
                  : "text-white/30 border-l-2 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="opacity-20 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate">{t.name.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
      <audio ref={audioRef} loop />
    </aside>
  );
}
