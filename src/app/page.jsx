"use client";

import {
  useReadContract,
  useAccount,
  useSendTransaction,
  useContract,
} from "@starknet-react/core";
import * as ethContract from "@/contracts/eth";
import * as gameContract from "@/contracts/game";
import dynamic from "next/dynamic";
import { Contract } from "starknet";
import { useEffect, useState } from "react";
import { RpcProvider } from "starknet";

const WalletBar = dynamic(() => import("../components/ui/WalletBar"), {
  ssr: false,
});

export default function Home() {
  const { address: userAddress } = useAccount();
  const [prizePool, setPrizePool] = useState(null);
  const [points, setPoints] = useState(0);
  const [prizePoolIsFetching, setPrizePoolIsFetching] = useState(false);
  const [pointsIsFetching, setPointsIsFetching] = useState(false);

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

  // TODO: Temporary; it should be read from utils, but it's failing. Not sure why.
  const provider = new RpcProvider({
    nodeUrl: process.env.NODE_URL,
    headers: {
      "x-apikey": process.env.API_KEY,
    },
  });

  // Read prize pool
  const readPrizePool = async () => {
    try {
      const { abi: contractAbi } = await provider.getClassAt(
        gameContract.address
      );
      if (!contractAbi) {
        throw new Error("Contract ABI not found.");
      }

      const contract = new Contract(
        gameContract.abi,
        gameContract.address,
        provider
      );

      const balance = await contract.get_prize_pool();
      console.log("test: ", balance);
      setPrizePool(balance);

      return balance;
    } catch (error) {
      console.error("Error reading contract balance:", error);
    }
  };

  // Read points
  const readPoints = async () => {
    try {
      const { abi: contractAbi } = await provider.getClassAt(
        gameContract.address
      );

      if (!contractAbi) {
        throw new Error("Contract ABI not found.");
      }

      const contract = new Contract(
        contractAbi,
        gameContract.address,
        provider
      );

      const points = await contract.get_user_points(userAddress);
      setPoints(points);

      return points;
    } catch (error) {
      console.error("Error reading contract balance:", error);
    }
  };

  useEffect(() => {
    const fetchPrizePool = async () => {
      setPrizePoolIsFetching(true);
      const balance = await readPrizePool();
      setPrizePool(balance);
      setPrizePoolIsFetching(false);
      setPointsIsFetching(true);

      if (userAddress) {
        const points = await readPoints();
        setPoints(points);
        setPointsIsFetching(false);
      }
    };

    fetchPrizePool();
  }, [userAddress]);

  // Place bet
  const play = async () => {
    try {
      const transactionResult = await sendTransferEthTransaction([
        ethContractInstance.populate("approve", [
          gameContractInstance.address,
          0.00002 * 10 ** 18,
        ]),
        // half a dollar (0.5 USD) would be approximately 0.0001643485 ETH - converting to wei = 1.643485 * 10 ** 14
        // should pass this to test on starkscan 164348500000000000
        gameContractInstance.populate("place_bet", [0.000002 * 10 ** 18]),
      ]);

      console.log(
        "test - Transaction hash:",
        transactionResult.transaction_hash
      );

      await provider.waitForTransaction(transactionResult.transaction_hash); //TODO:
      await readPrizePool();
      await readPoints();
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const convertWeiToEth = (wei) => (wei ? Number(wei) / 10 ** 18 : null);
  const convertedPrizePoolStarknetJS = convertWeiToEth(prizePool);

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
          <div>
            Prize pool:
            {prizePoolIsFetching
              ? "Loading..."
              : `${convertedPrizePoolStarknetJS || 0} ETH`}
          </div>
          <div>Points: {pointsIsFetching ? "Loading..." : points}</div>
        </>
      ) : (
        <div>Please select a wallet and connect</div>
      )}
    </div>
  );
}
