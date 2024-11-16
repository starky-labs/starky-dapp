"use client";

import { useState } from "react";
import { useReadContract, useAccount } from "@starknet-react/core";
import game_abi from "../contracts/game_abi.json";
import dynamic from "next/dynamic";

const WalletBar = dynamic(() => import("../components/WalletBar"), {
  ssr: false,
});

function decodeU256(u256: { low: number; high: number }) {
  if (!u256 || !u256.low || !u256.high) return 0;
  const low = BigInt(u256.low);
  const high = BigInt(u256.high);
  return (high << 128n) + low;
}

function displayPrizePool(weiValue: number) {
  const etherValue = weiValue / 1e18;
  if (etherValue < 0.000001) {
    return `${weiValue} wei`; // Display in wei for very small values
  }
  return `${etherValue.toFixed(18)} ETH`; // Display in Ether for larger values
}

export default function Home() {
  const [betStatus, setBetStatus] = useState(null);
  const { address: userAddress } = useAccount();

  console.log({ userAddress });

  const play = async () => {
    try {
      const response = await fetch("/api/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "John Doe", action: "Hello!" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      console.log("Response data:", data);
      setBetStatus(data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // Read prize pool
  const {
    data: prizePool,
    isLoading: prizePoolIsLoading,
    error: prizePoolError,
  } = useReadContract({
    address:
      "0x001058b0fd2e63557dc7ee60dce5f45febb49f59518f330688a321e95b6b2e46",
    abi: game_abi,
    functionName: "get_prize_pool",
  });

  // Read user points
  const { data: points, isLoading: pointsIsLoading } = useReadContract({
    address:
      "0x001058b0fd2e63557dc7ee60dce5f45febb49f59518f330688a321e95b6b2e46",
    abi: game_abi,
    functionName: "get_user_points",
    args: [userAddress],
  });

  console.log({
    prizePool: displayPrizePool(Number(decodeU256(prizePool))),
    prizePoolIsLoading,
    prizePoolError,
    points,
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row mb-4">
        <WalletBar />
      </div>
      <button
        onClick={play}
        className="border-2 border-blue-500 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition-all"
      >
        Play
      </button>
      <div>Prize pool: {prizePoolIsLoading ? "Loading..." : prizePool} </div>
      <div>Points: {pointsIsLoading ? "Loading..." : points}</div>
    </div>
  );
}
