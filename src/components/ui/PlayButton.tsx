import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

interface PlayButtonProps {
  onClick: () => void;
}

export default function PlayButton({ onClick }: PlayButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <Button
        size="lg"
        onClick={onClick}
        className="relative px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
      >
        <Sparkles className="mr-2 h-5 w-5" />
        Play
      </Button>
    </motion.div>
  );
}