import { Button } from "@/components/ui/Button";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useEffect, useMemo } from "react";

export default function WalletButton() {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const shortenedAddress = useMemo(() => {
    if (!address) {
      return "";
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const handleConnect = () => {
    const cartridgeConnector = connectors[0];
    if (cartridgeConnector) {
      connect({ connector: cartridgeConnector });
    }
  };

  useEffect(() => {
    if (address) {
      const connectSound = new Audio("/sounds/robot-click.wav");
      connectSound.play();
    }
  }, [address]);

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      {address ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {shortenedAddress}
          </span>
          <Button className="flex flex-row items-center justify-items-start p-2 rounded min-w-40 border-2 border-primary" variant="outline" onClick={() => disconnect()}>
            <Wallet className="mr-2 h-4 w-4" />
            Connected
          </Button>
        </div>
      ) : (
        <Button onClick={handleConnect} className="font-medium">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </motion.div>
  );
}
