"use client";
import { useEffect, useRef, useState } from "react";
import { checkForEvents } from "@/shared/blockchain-listener";
import { provider } from "@/components/utils";
import { address } from "@/contracts/game";

/**
 * Basic hook that listens for "transfer_prize" events.
 */
export function useTransferPrizeListener() {
  const [lastCheckedBlock, setLastCheckedBlock] = useState(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // On mount, immediately set lastCheckedBlock to the current block
  useEffect(() => {
    async function initLastBlock() {
      try {
        const currentBlock = await provider.getBlockNumber();
        if (isMountedRef.current) {
          setLastCheckedBlock(currentBlock-3);
        }
      } catch (err) {
        console.error("Error fetching initial block:", err);
      }
    }

    initLastBlock();
  }, []);

  // Poll every 3s for new events, starting from lastCheckedBlock
  useEffect(() => {
    if (lastCheckedBlock === null) {
      return;
    }

    console.log("test - HHHH: ", { lastCheckedBlock });

    async function pollEvents() {
      try {
        const currentBlock = await provider.getBlockNumber();
        console.log("test - HHHH - 1: ", { lastCheckedBlock, currentBlock });

        if (lastCheckedBlock >= currentBlock) {
          console.log("No new blocks");
          return;
        }

        const events = await checkForEvents({
          provider,
          contractAddress: address,
          eventName: "transfer_prize",
          fromBlock: lastCheckedBlock,
          toBlock: currentBlock,
        });

        console.log(
          "test - HHHH - 3: ",
          { events },
          events.length > 0,
          isMountedRef.current
        );

        // Temporary - Show an alert for each event
        if (events.length > 0 && isMountedRef.current) {
          events.forEach((ev) => {
            window.alert(
              `New transfer_prize event found: TxHash = ${ev.transaction_hash}`
            );
          });
        }

        setLastCheckedBlock(currentBlock);
      } catch (err) {
        console.error("Error polling transfer_prize events:", err);
      }
    }

    const interval = setInterval(pollEvents, 3000);
    return () => clearInterval(interval);
  }, [lastCheckedBlock]);

  // This hook currently doesn't return anything, it just runs in the background
}
