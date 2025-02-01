import { Contract, RPC } from "starknet";
import { address } from "../../contracts/game.js";
import { provider, account } from "../utils.js";

async function transferPrize(recipient, transactionHash) {
  console.log("Initiating prize to: ", recipient);

  try {
    const { abi } = await provider.getClassAt(address);
    if (abi === undefined) {
      throw new Error("no abi.");
    }
    const contract = new Contract(abi, address, provider);
    contract.connect(account);

    const transferPrize = contract.populate("transfer_prize", [
      recipient,
      transactionHash,
    ]);
    const txResponse = await account.execute(transferPrize, {
      version: 3,
      maxFee: 10 ** 15,
      feeDataAvailabilityMode: RPC.EDataAvailabilityMode.L1,
      tip: 10 ** 13,
      paymasterData: [],
      resourceBounds: {
        l1_gas: {
          max_amount: "0x7D0",          // 2000 in decimal
          max_price_per_unit: "0xFFFFFFFFFFFF" // ~281,474,976,710,655 decimal
        },
        l2_gas: {
          max_amount: "0x0",
          max_price_per_unit: "0x0"
        }
      },
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
    console.error("Failed to transfer prize.", error.stack);
    console.error("Failed to transfer prize.", error.log);
    throw new Error("Failed to transfer prize.", error.message);
  }
}

function isWinnerBet() {
  return Math.random() < 0.9;
}

export { isWinnerBet, transferPrize };
