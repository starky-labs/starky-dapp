"use client";
import { useEffect, useRef, useState } from "react";
import { checkForEvents } from "@/shared/blockchain-listener";
import { provider } from "@/components/utils";
import { address } from "@/contracts/game";

/**
 * Hook that listens for "PrizeTransferred" events and returns an object with:
 * - txHashes: an array of transaction hashes.
 * - clearTxHashes: a function to clear the array.
 */
export function useTransferPrizeListener() {
  const [lastCheckedBlock, setLastCheckedBlock] = useState(null);
  const [txHashes, setTxHashes] = useState([]);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // On mount, initialize the last checked block to the current block number
  useEffect(() => {
    async function initLastBlock() {
      try {
        const currentBlock = await provider.getBlockNumber();
        if (isMountedRef.current) {
          setLastCheckedBlock(currentBlock);
        }
      } catch (err) {
        console.error("Error fetching initial block:", err);
      }
    }

    initLastBlock();
  }, []);

  // Poll for new events every 3 seconds
  useEffect(() => {
    if (lastCheckedBlock === null) {
      return;
    }

    async function pollEvents() {
      try {
        const currentBlock = await provider.getBlockNumber();

        if (lastCheckedBlock >= currentBlock) {
          console.log("No new blocks");
          return;
        }

        const events = await checkForEvents(
          provider,
          address,
          "PrizeTransferred",
          lastCheckedBlock,
          currentBlock
        );

        if (events.length > 0 && isMountedRef.current) {
          const newTxHashes = events.map((ev) => ev.transaction_hash);
          setTxHashes((prev) => [...prev, ...newTxHashes]);
        }

        setLastCheckedBlock(currentBlock);
      } catch (err) {
        console.error("Error polling transfer_prize events:", err);
      }
    }

    const interval = setInterval(pollEvents, 3000);
    return () => clearInterval(interval);
  }, [lastCheckedBlock]);

  // Function to clear the txHashes
  const clearTxHashes = () => setTxHashes([]);

  return { txHashes, clearTxHashes };
}
