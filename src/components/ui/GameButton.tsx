import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import FloatingNumber from "./FloatingNumber";

interface PlayButtonProps {
  onClick: () => void;
}

const PlayButton = ({ onClick }: PlayButtonProps) => {
  const [showNumber, setShowNumber] = useState(false);
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    const clickSound = new Audio("/sounds/water-bleep.wav");
    clickSound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });

    // Get click position for animation
    const button = e.currentTarget;
    const container = button.parentElement;
    if (!container) {
      return;
    }

    // Get bounding rectangles
    const buttonRect = button.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate position relative to the container
    const x = buttonRect.left - containerRect.left + buttonRect.width / 2;
    const y = buttonRect.top - containerRect.top + buttonRect.height / 2;

    // Set animation starting position
    setAnimationPosition({ x, y });

    // Restart the animation
    setShowNumber(false);
    requestAnimationFrame(() => setShowNumber(true));

    // Hide animation after completion
    setTimeout(() => setShowNumber(false), 3000);
    onClick();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <FloatingNumber
        isVisible={showNumber}
        x={animationPosition.x}
        y={animationPosition.y}
      />
      <Button
        onClick={handleClick}
        className="px-8 py-4 bg-primary hover:bg-primary/90 rounded-full"
      >
        Play
      </Button>
    </motion.div>
  );
};

export default PlayButton;
