"use client";

import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import dynamic from "next/dynamic";
import { useGameLogic } from "../components/hooks/useGameLogic";

const WalletBar = dynamic(() => import("../components/ui/WalletBar"), {
  ssr: false,
});

export default function Home() {
  const { address: userAddress } = useAccount();
  const { prizePool, points, prizePoolIsFetching, pointsIsFetching, play } =
    useGameLogic(userAddress);
  const [maxSpend, setMaxSpend] = useState(0.01);

  const handleMaxSpendChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setMaxSpend(value);
    }
  };

  const handlePlay = () => {
    if (maxSpend > 0) {
      play(maxSpend);
    } else {
      alert("Please enter a valid maximum spend amount.");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row mb-4">
        <WalletBar />
      </div>
      {userAddress ? (
        <>
          <input
            type="number"
            step="0.001"
            min="0"
            value={maxSpend}
            onChange={handleMaxSpendChange}
            placeholder="Max Spend (ETH)"
            className="border-2 border-gray-300 rounded px-4 py-2 mb-4"
          />
          <button
            onClick={handlePlay}
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
              <div>Points: {pointsIsFetching ? "Loading..." : points}</div>
            </>
          )}
        </>
      ) : (
        <div>Please select a wallet and connect</div>
      )}
    </div>
  );
}
