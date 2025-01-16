import { useState, useCallback } from "react";
import { Contract } from "starknet";
import { provider, convertWeiToEth } from "@/components/utils";
import * as gameContract from "@/contracts/game";
import * as ethContract from "@/contracts/eth";
import { useSendTransaction, useContract } from "@starknet-react/core";

export const useGameLogic = (userAddress) => {
  const [prizePool, setPrizePool] = useState(null);
  const [points, setPoints] = useState(0);
  const [prizePoolIsFetching, setPrizePoolIsFetching] = useState(false);
  const [pointsIsFetching, setPointsIsFetching] = useState(false);

  const { sendAsync: sendTransferEthTransaction } = useSendTransaction({});
  const { contract: ethContractInstance } = useContract({
    abi: ethContract.abi,
    address: ethContract.address,
  });
  const { contract: gameContractInstance } = useContract({
    abi: gameContract.abi,
    address: gameContract.address,
  });

  const readPrizePool = useCallback(async () => {
    try {
      setPrizePoolIsFetching(true);
      const contract = new Contract(
        gameContract.abi,
        gameContract.address,
        provider
      );
      const balance = await contract.get_prize_pool();
      setPrizePool(convertWeiToEth(balance));
      setPrizePoolIsFetching(false);
      return balance;
    } catch (error) {
      setPrizePoolIsFetching(false);
      console.error("Error reading contract balance:", error);
    }
  }, []);

  const readPoints = useCallback(async () => {
    if (!userAddress) return;
    try {
      setPointsIsFetching(true);
      const contract = new Contract(
        gameContract.abi,
        gameContract.address,
        provider
      );
      const points = await contract.get_user_points(userAddress);
      setPoints(points);
      setPointsIsFetching(false);
      return points;
    } catch (error) {
      setPointsIsFetching(false);
      console.error("Error reading contract points:", error);
    }
  }, [userAddress]);

  const play = useCallback(
    async (amountToApprove) => {
      try {
        const amountToBet = 0.000002 * 10 ** 18;
        const maxAmount = amountToApprove * 10 ** 18;

        const transactionResult = await sendTransferEthTransaction([
          ethContractInstance.populate("approve", [
            gameContractInstance.address,
            maxAmount,
          ]),
          gameContractInstance.populate("place_bet", [amountToBet]),
        ]);

        console.log("Transaction details:", {
          transaction_hash: transactionResult.transaction_hash,
          userAddress,
        });

        await provider.waitForTransaction(transactionResult.transaction_hash);
        await readPrizePool();
        await readPoints();
      } catch (error) {
        console.error("Error during play:", error);
      }
    },
    [
      userAddress,
      sendTransferEthTransaction,
      ethContractInstance,
      gameContractInstance,
      readPrizePool,
      readPoints,
    ]
  );

  return {
    prizePool,
    points,
    prizePoolIsFetching,
    pointsIsFetching,
    readPrizePool,
    readPoints,
    play,
  };
};
