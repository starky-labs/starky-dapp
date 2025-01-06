import { Contract } from "starknet";
import { address, abi } from "../../contracts/game.js";
import { provider, account } from "../utils.js";

async function transferPrize(recipient, transactionHash) {
  console.log("Initiating prize to: ", recipient);

  try {
    const contract = new Contract(abi, address, provider);
    contract.connect(account);

    const txResponse = await account.execute({
      contractAddress: address,
      entrypoint: "transfer_prize",
      calldata: [recipient, transactionHash],
    });

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
    throw new Error("Failed to transfer prize.", error.message);
  }
}

function isWinnerBet() {
  return Math.random() < 0.5;
}

export { isWinnerBet, transferPrize };
