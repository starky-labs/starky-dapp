import { useState, useCallback, useEffect } from "react";
import { Contract } from "starknet";
import { provider, convertWeiToGwei} from "@/components/utils";
import * as gameContract from "@/contracts/game";
import * as ethContract from "@/contracts/eth";
import { useSendTransaction, useContract } from "@starknet-react/core";

export const useGameLogic = (userAddress) => {
  const [prizePool, setPrizePool] = useState(null);
  const [points, setPoints] = useState(0);
  const [prizePoolIsFetching, setPrizePoolIsFetching] = useState(false);
  const [pointsAreFetching, setPointsAreFetching] = useState(false);

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
      const contract = new Contract(gameContract.abi, gameContract.address, provider);
      const balance = await contract.get_prize_pool();
      setPrizePool(convertWeiToGwei(balance));
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
      setPointsAreFetching(true);
      const contract = new Contract(gameContract.abi, gameContract.address, provider);
      const points = await contract.get_user_points(userAddress);
      setPoints(points);
      setPointsAreFetching(false);
      return points;
    } catch (error) {
      setPointsAreFetching(false);
      console.error("Error reading contract points:", error);
    }
  }, [userAddress]);

  // On first load, update points and prize with values stored in the contract
  useEffect(() => {
    (async () => {
      await readPrizePool();
      await readPoints();
    })();
  }, [readPrizePool, readPoints]);

  const play = useCallback(async () => {
    try {
      const transactionResult = await sendTransferEthTransaction([
        ethContractInstance.populate("approve", [
          gameContractInstance.address,
          0.00002 * 10 ** 18,
        ]),
        gameContractInstance.populate("place_bet", [0.000002 * 10 ** 18]),
      ]);

      console.log("test - Transaction details:", {
        transaction_hash: transactionResult.transaction_hash,
        userAddress,
      });

      await provider.waitForTransaction(transactionResult.transaction_hash);
      await readPrizePool();
      await readPoints();
    } catch (error) {
      console.error("Error during play:", error);
    }
  }, [userAddress, sendTransferEthTransaction, ethContractInstance, gameContractInstance, readPrizePool, readPoints]);

  return {
    prizePool,
    points,
    prizePoolIsFetching,
    pointsAreFetching,
    readPrizePool,
    readPoints,
    play,
  };
};