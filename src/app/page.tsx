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

const WalletBar = dynamic(() => import("../components/ui/WalletBar"), {
  ssr: false,
});

export default function Home() {
  const { address: userAddress } = useAccount();

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

      refectchPrizePool();
      refectchPoints();

      console.log({ prizePool, points });
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  console.log({ prizePool, points });

  const convertWeiToEth = (wei) => (wei ? Number(wei) / 10 ** 18 : null);
  const convertedPrizePool = convertWeiToEth(prizePool);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row mb-4">
        <WalletBar />
      </div>
      {userAddress ? (
        <>
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
