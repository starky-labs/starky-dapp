import { loadState, saveState } from "./state-manager.js";
import { address } from "../../contracts/game.js";
import { isWinnerBet, transferPrize } from "../game-engine/index.js";
import { provider } from "../utils.js";
import { checkForEvents } from '../../shared/blockchain-listener.js';

let state = await loadState({
  fallbackLastCheckedBlock: (await provider.getBlockNumber()) - 10,
}); // maybe add the ability to provide configs, like path to state file


async function monitorBetPlacedTransactions() {
  let { lastCheckedBlock } = state;
  console.log("Last checked block:", lastCheckedBlock);

  const currentBlock = await provider.getBlockNumber();
  console.log("Current block:", currentBlock);

  if (lastCheckedBlock >= currentBlock) {
    console.log("No new blocks to process.");
    return;
  }

  const events = await checkForEvents(
    provider,
    address,
    "BetPlaced",
    lastCheckedBlock,
    currentBlock,
    50,
  );

  if (events.length > 0) {
    events.forEach(async (event) => {
      if (isWinnerBet()) {
        const userAddress = event.data[0];
        const transactionHash = event.transaction_hash;
        console.log("Winner bet found:", transactionHash);
        await transferPrize(userAddress, transactionHash);
      }
      console.log("Transaction not winner:");
    });
  }

  // Update latest checked block and persist state
  state.lastCheckedBlock = currentBlock;
  await saveState(state);
}

function run() {
  monitorBetPlacedTransactions()
    .catch(console.error)
    .finally(() => {
      setTimeout(run, 5000);
    });
}

run();
