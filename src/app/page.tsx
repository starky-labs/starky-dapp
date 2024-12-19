"use client";

import {
  useReadContract,
  useAccount,
  useSendTransaction,
  useContract,
} from "@starknet-react/core";
import game_abi from "../contracts/game_abi.json";
import * as ethContract from "@/contracts/eth";
import * as gameContract from "@/contracts/game";
import dynamic from "next/dynamic";
import { GAME_CONTRACT } from "./constants";
import { useEffect, useState } from "react";

const WalletBar = dynamic(() => import("../components/ui/WalletBar"), {
  ssr: false,
});

export default function Home() {
  const { address: userAddress, connector } = useAccount();

  const [approveAmount, setApproveAmount] = useState<string>("0.1");
  const [betAmount, setBetAmount] = useState<string>("0.0002");
  const [remainingApproval, setRemainingApproval] = useState<string>("0");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // contracts
  const { contract: ethContractInstance } = useContract({
    abi: ethContract.abi,
    address: ethContract.address,
  });

  const { contract: gameContractInstance } = useContract({
    abi: gameContract.abi,
    address: gameContract.address,
  });

  const { sendAsync: sendTransferEthTransaction } = useSendTransaction({});

  // Read prize pool
  const {
    data: prizePool,
    refetch: refectchPrizePool,
    isLoading: prizePoolIsLoading,
  } = useReadContract({
    address: ethContractInstance.address,
    abi: ethContractInstance.abi,
    functionName: "balance_of",
    args: [GAME_CONTRACT],
    watch: true,
    refetchInterval: 10,
  });

  // Read user points
  const {
    data: points,
    refetch: refectchPoints,
    isLoading: pointsIsLoading,
  } = useReadContract({
    address: GAME_CONTRACT,
    abi: game_abi,
    functionName: "get_user_points",
    args: [userAddress],
    watch: true,
    refetchInterval: 10,
  });

  console.log({ prizePool, points });
  // Convert ETH to Wei
  const convertEthToWei = (ethAmount: string): string => {
    try {
      // Multiply by 10^18 to convert to wei, round to avoid floating point issues
      return BigInt(Math.round(parseFloat(ethAmount) * 10 ** 18)).toString();
    } catch (error) {
      console.error("Conversion error:", error);
      return "0";
    }
  };

  // Place bet
  const play = async () => {
    try {
      await sendTransferEthTransaction([
        ethContractInstance.populate("approve", [
          gameContractInstance.address,
          0.00002 * 10 ** 18,
        ]),
        // half a dollar (0.5 USD) would be approximately 0.0001643485 ETH - converting to wei = 1.643485 * 10 ** 14
        // should pass this to test on starkscan 164348500000000000
        gameContractInstance.populate("place_bet", [0.000002 * 10 ** 18]),
      ]);

      // Refetch data
      refectchPrizePool();
      refectchPoints();

      console.log({ prizePool, points });
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  console.log({ prizePool, points });
  console.log("Connector details:", connector);

  const handleModalClose = () => {
    setRemainingApproval(convertEthToWei(approveAmount));
    setModalOpen(false);

    localStorage.setItem("modalShown", "true");
  };

  const handleApprovalExhausted = () => {
    setModalOpen(true);
    localStorage.removeItem("modalShown");
  };

  useEffect(() => {
    const modalAlreadyShown = localStorage.getItem("modalShown");
    if (!modalAlreadyShown) {
      // If the modal hasn't been shown before, display it
      setModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (BigInt(remainingApproval) <= 0) {
      handleApprovalExhausted();
    }
  }, [remainingApproval]);

  useEffect(() => {
    if (!userAddress) {
      console.log("Wallet disconnected. Resetting state...");
      // Reset app-specific wallet-related states
      setRemainingApproval("0");
      setApproveAmount("0.1");
      setBetAmount("0.0002");
    }
  }, [userAddress]);

  const convertWeiToEth = (wei) => (wei ? Number(wei) / 10 ** 18 : null);
  const convertedPrizePool = convertWeiToEth(prizePool);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row mb-4">
        <WalletBar />
      </div>
      {userAddress ? (
        <>
          {/*    {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg space-y-4 w-96">
                <h2 className="text-lg font-bold">Set Your Values</h2>
                <div className="flex flex-col">
                  <label className="mb-2">Approve Amount (ETH)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={approveAmount}
                    onChange={(e) => setApproveAmount(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Bet Amount (ETH)</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <button
                  onClick={handleModalClose}
                  className="border-2 border-blue-500 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          )} */}
          <div className="flex flex-col items-center space-y-4 w-full max-w-md">
            <button
              onClick={play}
              className="border-2 border-blue-500 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition-all"
            >
              Play
            </button>
            <div>
              Prize pool:
              {prizePoolIsLoading ? "Loading..." : `${convertedPrizePool} ETH`}
            </div>
            <div>Points: {pointsIsLoading ? "Loading..." : points}</div>
          </div>
        </>
      ) : (
        <div>Please select a wallet and connect</div>
      )}
    </div>
  );
}
