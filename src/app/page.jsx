"use client";
import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useAccount } from "@starknet-react/core";
import { useGameLogic } from "@/components/hooks/useGameLogic";
import PrizeAnimation from "@/components/ui/PrizeAnimation";
import WalletButton from "@/components/ui/WalletButton";
import PlayButton from "@/components/ui/PlayButton";

const MotionNumber = dynamic(
  () =>
    import("motion-number").then((mod) => {
      return mod.default || mod.MotionNumber;
    }),
  { ssr: false }
);

export default function Home() {
  const { address: userAddress } = useAccount();
  const { prizePool, points, play } = useGameLogic(userAddress);
  const [userPoints, setUserPoints] = useState(Number(points));
  const [hasInteracted, setHasInteracted] = useState(false);
  const prevPointsRef = useRef(points);

  // Set a flag when the user interacts (click) with the page
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("click", handleUserInteraction);
    };
    window.addEventListener("click", handleUserInteraction);
    return () => window.removeEventListener("click", handleUserInteraction);
  }, []);

  // Play sound on points change, only if the user has interacted with the document
  useEffect(() => {
    if (
      hasInteracted &&
      prevPointsRef.current !== undefined &&
      prevPointsRef.current !== points
    ) {
      const pointsSound = new Audio("/sounds/jumping-sound.wav");
      pointsSound
        .play()
        .catch((err) => console.error("Error playing points sound:", err));
    }
    prevPointsRef.current = points;
  }, [points, hasInteracted]);

  useEffect(() => {
    if (points) {
      setUserPoints(Number(points));
    }
  }, [points]);

  console.log("test: ", { points: userPoints });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-gray-950">
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
                <PrizeAnimation />
                <div className="relative px-8 py-4 bg-background border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Prize Pool
                  </div>
                  <div className="text-sm font-bold">{prizePool} Gwei</div>
                </div>
              </div>
            </div>
            <PlayButton onClick={play} />
          </>
        ) : (
          <div className="mb-12 text-center">
            <div className="text-sm text-muted-foreground mb-1">
              Please connect wallet
            </div>
          </div>
        )}
      </main>
      {userAddress && (
        <footer className="fixed bottom-0 border-t w-full p-2 bg-gray-950 text-gray-200 flex justify-between items-center">
          <div className="flex flex-row items-center justify-items-start p-2 rounded min-w-40 border-2 border-primary">
            <Image
              src="/images/coin-points.svg"
              alt="Points Icon"
              width={30}
              height={30}
              className="mr-1"
            />
            <p className="text-lg font-bold mr-1">Points:</p>
            <MotionNumber
              key={userPoints}
              className="font-bold text-lg"
              value={userPoints}
              format={(value) => String(Math.round(value))}
              locales="en-US"
              transition={{
                layout: { type: "spring", duration: 0.7, bounce: 0 },
                y: { type: "spring", duration: 0.7, bounce: 0.25 },
                opacity: { duration: 0.7, ease: "easeOut", times: [0, 0.3] },
              }}
              style={{ lineHeight: 0.9 }}
            />
          </div>
        </footer>
      )}
    </div>
  );
}
