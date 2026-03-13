import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";

const Particle = ({ index }: { index: number }) => {
  const props = useMemo(() => ({
    size: Math.random() * 5 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 2.5 + 1.5,
    delay: Math.random() * 1.5,
  }), []);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: props.size,
        height: props.size,
        left: `${props.x}%`,
        top: `${props.y}%`,
        background: index % 3 === 0
          ? "hsl(175 80% 60% / 0.8)"
          : index % 3 === 1
          ? "hsl(260 60% 65% / 0.6)"
          : "hsl(200 80% 60% / 0.5)",
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 2, 0],
        y: [0, -30, -60],
      }}
      transition={{
        duration: props.duration,
        delay: props.delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
};

const Ring = ({ delay, size }: { delay: number; size: number }) => (
  <motion.div
    className="absolute rounded-full border"
    style={{
      width: size,
      height: size,
      borderColor: "hsl(175 80% 50% / 0.1)",
    }}
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: [0.5, 1.5], opacity: [0.4, 0] }}
    transition={{ duration: 2.5, delay, repeat: Infinity, ease: "easeOut" }}
  />
);

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);

  const handleComplete = useCallback(() => {
    setVisible(false);
    setTimeout(onComplete, 600);
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(handleComplete, 3000);
    return () => clearTimeout(timer);
  }, [handleComplete]);

  const title = "Vani-Kanoon";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, hsl(225 25% 10%), hsl(225 25% 4%) 70%)",
          }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Particles */}
          {Array.from({ length: 50 }).map((_, i) => (
            <Particle key={i} index={i} />
          ))}

          {/* Expanding rings */}
          <Ring delay={0} size={200} />
          <Ring delay={0.8} size={300} />
          <Ring delay={1.6} size={400} />

          {/* Glow orbs */}
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(175 80% 50% / 0.12), transparent 60%)",
              filter: "blur(60px)",
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.7, 0.3],
              x: [0, 30, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-72 h-72 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(260 60% 55% / 0.12), transparent 60%)",
              filter: "blur(60px)",
              top: "30%",
              right: "30%",
            }}
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.2, 0.6, 0.2],
              y: [0, -20, 0],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Horizontal light sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(175 80% 50% / 0.04) 50%, transparent 100%)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Content */}
          <div className="text-center z-10 flex flex-col items-center">
            {/* Logo flash */}
            <motion.div
              className="w-20 h-20 rounded-2xl mb-8 flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, hsl(175 80% 50% / 0.15), hsl(260 60% 55% / 0.15))",
                border: "1px solid hsl(175 80% 50% / 0.2)",
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", type: "spring", stiffness: 150 }}
            >
              <motion.span
                className="text-3xl font-bold glow-text"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                VK
              </motion.span>
              {/* Flash burst on logo */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: "0 0 40px hsl(175 80% 50% / 0.4)" }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>

            {/* Title with letter-by-letter animation */}
            <div className="flex overflow-hidden">
              {title.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="text-5xl md:text-7xl font-bold glow-text tracking-tight"
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.06,
                    ease: "easeOut" as const,
                  }}
                >
                  {char === "-" ? "\u2011" : char}
                </motion.span>
              ))}
            </div>

            {/* Subtitle with line reveal */}
            <motion.div className="mt-5 overflow-hidden">
              <motion.p
                className="text-muted-foreground text-lg tracking-[0.3em] uppercase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                AI Legal Assistant
              </motion.p>
            </motion.div>

            {/* Underline glow */}
            <motion.div
              className="mt-4 h-px rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(175 80% 50% / 0.6), hsl(260 60% 55% / 0.6), transparent)",
              }}
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
            />

            {/* Loading dots */}
            <div className="flex gap-2 mt-8">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary/60"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, delay: 1.8 + i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
