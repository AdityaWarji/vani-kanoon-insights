import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

const Particle = ({ index }: { index: number }) => {
  const size = Math.random() * 4 + 2;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const duration = Math.random() * 3 + 2;
  const delay = Math.random() * 2;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: index % 2 === 0
          ? "hsl(175 80% 50% / 0.6)"
          : "hsl(260 60% 55% / 0.4)",
      }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);

  const handleComplete = useCallback(() => {
    setVisible(false);
    setTimeout(onComplete, 500);
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(handleComplete, 3000);
    return () => clearTimeout(timer);
  }, [handleComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(225 25% 4%), hsl(225 25% 8%), hsl(260 20% 8%))",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <Particle key={i} index={i} />
          ))}

          {/* Glow orbs */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(175 80% 50% / 0.15), transparent 70%)",
              filter: "blur(40px)",
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full translate-x-20 -translate-y-10"
            style={{
              background: "radial-gradient(circle, hsl(260 60% 55% / 0.15), transparent 70%)",
              filter: "blur(40px)",
            }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          <motion.div className="text-center z-10">
            <motion.h1
              className="text-5xl md:text-7xl font-bold glow-text tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Vani-Kanoon
            </motion.h1>
            <motion.p
              className="mt-4 text-muted-foreground text-lg tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              AI Legal Assistant
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
