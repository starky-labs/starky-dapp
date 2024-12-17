import "dotenv/config";
import { Contract } from "starknet";
import { address } from "../../contracts/game.js";
import { provider, account } from "../utils.js";

async function transferPrize(recipient) {
  console.log("Initiating prize to: ", recipient);

  const { abi } = await provider.getClassAt(address);
  if (abi === undefined) {
    throw new Error("no abi.");
  }

  const gameContract = new Contract(abi, address, provider);

  // Connect the account with contract to allow signing transactions
  gameContract.connect(account);

  try {
    const txResponse = await account.execute({
      contractAddress: address,
      entrypoint: "transfer_prize",
      calldata: [recipient],
    });

    // Wait for transaction confirmation
    const txReceipt = await provider.waitForTransaction(
      txResponse.transaction_hash
    );

    console.log(`Prize transferred to ${recipient}`);

    if (txReceipt.execution_status !== "SUCCEEDED") {
      throw new Error(
        `Transfer failed with status: ${txReceipt.execution_status}`
      );
    }

    return txReceipt;
  } catch (error) {
    console.error("Error transferring prize:", error);
    throw new Error("Failed to transfer prize.");
  }
}

function isWinnerBet() {
  return Math.random() < 0.5;
}

export { isWinnerBet, transferPrize };
