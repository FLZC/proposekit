"use client";

import { createContext, useCallback, useContext, useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type Ctx = { start: () => void; done: () => void };
const LoadingCtx = createContext<Ctx>({ start: () => {}, done: () => {} });
export const useLoading = () => useContext(LoadingCtx);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"idle" | "active" | "exiting">("idle");
  const [progress, setProgress] = useState(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const trickle = useRef<ReturnType<typeof setInterval>>(undefined);
  const pathname = usePathname();
  const mounted = useRef(false);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
      clearInterval(trickle.current);
    };
  }, []);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (phaseRef.current === "active") {
      clearInterval(trickle.current);
      setProgress(100);
      setPhase("exiting");
      timer.current = setTimeout(() => { setPhase("idle"); setProgress(0); }, 500);
    }
  }, [pathname]);

  const start = useCallback(() => {
    clearTimeout(timer.current);
    clearInterval(trickle.current);
    setProgress(0);
    setPhase("active");

    timer.current = setTimeout(() => {
      setProgress(15 + Math.random() * 12);
      trickle.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) { clearInterval(trickle.current); return prev; }
          const remaining = 85 - prev;
          return prev + remaining * 0.08 + Math.random() * 1.5;
        });
      }, 400);
    }, 80);
  }, []);

  const done = useCallback(() => {
    clearInterval(trickle.current);
    setProgress(100);
    setPhase("exiting");
    timer.current = setTimeout(() => { setPhase("idle"); setProgress(0); }, 500);
  }, []);

  return (
    <LoadingCtx.Provider value={{ start, done }}>
      {children}
      <div
        className="fixed inset-x-0 top-0 z-[9999] h-[3px] pointer-events-none transition-opacity duration-300"
        style={{ opacity: phase !== "idle" ? 1 : 0 }}
      >
        <div
          className="h-full bg-amber-400 transition-all duration-300 ease-out rounded-r-full"
          style={{
            width: `${progress}%`,
            boxShadow: progress > 0 ? "0 0 6px rgba(196,112,79,0.4)" : "none",
          }}
        />
      </div>
    </LoadingCtx.Provider>
  );
}
