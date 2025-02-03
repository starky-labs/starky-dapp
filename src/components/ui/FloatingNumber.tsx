import { motion, AnimatePresence } from "framer-motion";

interface FloatingNumberProps {
  isVisible: boolean;
  x: number;
  y: number;
}

const FloatingNumber = ({ isVisible, x, y }: FloatingNumberProps) => {
  const direction = Math.random() > 0.5 ? 1 : -1;
  const arcRadius = Math.random() * 100 + 50; // 100-300px radius

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0.8,
            scale: 0.8,
            x,
            y
          }}
          animate={{
            opacity: [0.8, 1, 1, 1, 1, 0],
            scale: [0.8, 1.2, 1, 1, 0.9, 0.8],
            x: [
              x,
              x + (direction * arcRadius * 0.1),
              x + (direction * arcRadius * 0.25),
              x + (direction * arcRadius * 0.4),
              x + (direction * arcRadius * 0.6),
              x + (direction * arcRadius * 0.8),
            ],
            y: [
              y,
              y - 100,
              y - 90, 
              y - 50,
              y + 50,
              y + 150,
            ],
          }}
          transition={{
            duration: 3,
            times: [0, 0.15, 0.3, 0.5, 0.8, 1],
            ease: "easeOut"
          }}
          className="absolute pointer-events-none z-50 text-[#64e3ff] font-bold text-2xl"
          style={{
            textShadow: '0 0 10px rgba(100, 227, 255, 0.8)',
          }}
        >
          +1
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FloatingNumber;