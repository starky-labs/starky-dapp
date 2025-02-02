"use client";

import { useAccount } from "@starknet-react/core";
import { useGameLogic } from "@/components/hooks/useGameLogic";
import { useTransferPrizeListener } from "@/components/hooks/useTransferPrizeListener";
import WalletButton from "@/components/ui/WalletButton";
import GameButton from "@/components/ui/GameButton";

export default function Home() {
  const { address: userAddress } = useAccount();
  const { prizePool, points, prizePoolIsFetching, pointsAreFetching, play } =
    useGameLogic(userAddress);

  useTransferPrizeListener();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            STARKY
          </h1>
          <WalletButton />
        </div>
      </header>

      <main className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center">
        {userAddress ? (
          <>
            <div className="mb-12 text-center">
              <div className="relative inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-30"></div>
                <div className="relative px-8 py-4 bg-background border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Prize Pool
                  </div>
                  <div className="text-sm font-bold">
                    {prizePoolIsFetching
                      ? "Loading..."
                      : `${prizePool ?? 0} ETH`}
                  </div>
                </div>
              </div>
            </div>
            <GameButton onClick={play} />
          </>
        ) : (
          <div className="mb-12 text-center">
            <div className="text-sm text-muted-foreground mb-1">
              Please connect wallet
            </div>
          </div>
        )}
      </main>
      <div className="fixed bottom-4 left-4">
        <div className="text-sm text-muted-foreground">Points</div>
        <div className="text-xl font-semibold">
          {pointsAreFetching ? "Loading..." : points}
        </div>
      </div>
    </div>
  );
}
