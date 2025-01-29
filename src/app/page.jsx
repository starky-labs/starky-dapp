"use client";

import { useAccount } from "@starknet-react/core";
import dynamic from "next/dynamic";
import { useGameLogic } from "@/components/hooks/useGameLogic";
import { useTransferPrizeListener } from "@/components/hooks/useTransferPrizeListener";

const WalletBar = dynamic(() => import("../components/ui/WalletBar"), {
  ssr: false,
});

export default function Home() {
  const { address: userAddress } = useAccount();
  const { prizePool, points, prizePoolIsFetching, pointsAreFetching, play } =
    useGameLogic(userAddress);

  console.log('Listening on useTransferPrizeListener');
  useTransferPrizeListener();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row mb-4">
        <WalletBar />
      </div>
      {userAddress ? (
        <>
          <button
            onClick={play}
            className="border-2 border-blue-500 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition-all"
          >
            Play
          </button>
          {prizePoolIsFetching ? (
            "Loading..."
          ) : (
            <>
              <div>
                Prize pool:
                {`${prizePool || 0} ETH`}
              </div>
              <div>Points: {pointsAreFetching ? "Loading..." : points}</div>
            </>
          )}
        </>
      ) : (
        <div>Please select a wallet and connect</div>
      )}
    </div>
  );
}
