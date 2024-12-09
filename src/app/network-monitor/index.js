import { RpcProvider } from "starknet";
import { loadState, saveState } from "./state-manager.js";
import pLimit from "p-limit";

const limit = pLimit(2);

const provider = new RpcProvider({
  nodeUrl:
    "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/7SLc9bbjB60QiSGjhRjhgiDDjs1NJX3A",
});

export const contractAddress =
  "0x2c27b6caba176944a66319d051535b42e75df95179b3a6c9347533d04370088";


let state = await loadState({ fallbackLastCheckedBlock: await provider.getBlockNumber()-10 }); // maybe add the ability to provide configs, like path to state file

// Looking for transactions on GAME contract
async function checkIfItIsAGameTransaction(tx) {
  try {
    const txInfo = await provider.getTransaction(tx);

    if (
      txInfo.type === "INVOKE" &&
      txInfo.calldata.some((item) => item === contractAddress)
    ) {
      console.log(
        "Contract address found in calldata, and user address should be:",
        txInfo.calldata[1]
      );

      return { userAddress: txInfo.calldata[1] };
    }

    //console.log("Transaction does not involve the target contract.");
    return null;
  } catch (error) {
    console.error(`Error processing transaction ${tx}:`, error);
    return null;
  }
}

async function monitorContractTransactions() {
    let { lastCheckedBlock } = state;

    console.log("Last checked block:", lastCheckedBlock);

    const currentBlock = await provider.getBlockNumber();
    console.log("Current block:", currentBlock);

    // Loop through new blocks
    const blocksToFetch = [];
    for (let blockNumber = lastCheckedBlock + 1; blockNumber <= currentBlock; blockNumber++) {
        blocksToFetch.push(limit(() => provider.getBlock(blockNumber)));

        console.log("Fetching block:", blockNumber);
    }

    console.log("Fetching blocks:", blocksToFetch);
    // process.exit(0);
    await Promise.all(blocksToFetch).then((blocks) => {
        blocks.forEach((block) => {
            block.transactions.forEach(async (tx) => {
              const playerAddress = await checkIfItIsAGameTransaction(tx);

              if (!playerAddress) { // not a game transaction
                  return; 
              }

              console.log("Player address found:", playerAddress);
            });
        });
    });

    // Update latest checked block and persist state
    lastCheckedBlock = currentBlock;
    state = { lastCheckedBlock };

    await saveState(state);
    setTimeout(run, 1000);
}

function run() {
  monitorContractTransactions().catch(console.error);
}

run();
