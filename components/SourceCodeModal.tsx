
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Book, Code } from "lucide-react"; 

interface SourceCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  playSfx: (type: string) => void;
  githubLink: string;
  hfLink: string;
  kaggleLink: string;
}

export default function SourceCodeModal({
  isOpen,
  onClose,
  playSfx,
  githubLink,
  hfLink,
  kaggleLink,
}: SourceCodeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm p-1 border-2 border-cyber-yellow bg-black shadow-[0_0_50px_rgba(252,238,10,0.3)] clip-corner"
          >
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-cyber-yellow/30 pb-3">
                <h2 className="text-xl font-black text-cyber-yellow italic tracking-tighter uppercase">
                  Source_Archives
                </h2>
                <button
                  onClick={() => {
                    onClose();
                    playSfx("receive");
                  }}
                  className="text-white/60 hover:text-cyber-yellow hover:scale-125 transition-transform"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSfx("send")}
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyber-yellow transition-all clip-chamfer text-xs font-bold text-white/80 hover:text-cyber-yellow"
                >
                  <Github
                    size={18}
                    className="text-white/60 group-hover:text-cyber-yellow"
                  />
                  <span>GITHUB_REPOSITORY</span>{" "}
                </a>
                <a
                  href="https://www.kaggle.com/code/hamnamubarak/amadeus"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSfx("send")}
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyber-yellow transition-all clip-chamfer text-xs font-bold text-white/80 hover:text-cyber-yellow"
                >
                  <Book
                    size={18}
                    className="text-white/60 group-hover:text-cyber-yellow"
                  />
                  <span>HUGGING_FACE_SPACE</span>
                </a>
                <a
                  href="https://www.kaggle.com/code/hamnamubarak/amadeus"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSfx("send")}
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyber-yellow transition-all clip-chamfer text-xs font-bold text-white/80 hover:text-cyber-yellow"
                >
                  <Code
                    size={18}
                    className="text-white/60 group-hover:text-cyber-yellow"
                  />
                  <span>KAGGLE_NOTEBOOK</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
