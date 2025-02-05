import { useEffect, useState } from "react";
import { useTransferPrizeListener } from "@/components/hooks/useTransferPrizeListener";
import { motion, AnimatePresence } from "framer-motion";

const PrizeAnimation = () => {
  const { txHashes, clearTxHashes } = useTransferPrizeListener();
  const [displayedTxs, setDisplayedTxs] = useState([]);

  useEffect(() => {
    if (txHashes.length > 0) {
      setDisplayedTxs(txHashes);
      const timeout = setTimeout(() => {
        setDisplayedTxs([]);
        clearTxHashes();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [txHashes, clearTxHashes]);

  return (
    <div className="fixed top-0 left-0 z-50 w-full pointer-events-none">
      <AnimatePresence>
        {displayedTxs.map((tx) => (
          <motion.div
            key={tx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mx-auto my-2 p-2 md:p-4 bg-gray-800 text-primary rounded shadow-md w-11/12 max-w-md"
          >
            Prize transferred! TxHash: {tx}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PrizeAnimation;