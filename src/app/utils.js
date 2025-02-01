import { RpcProvider, Account, constants } from "starknet";
import "dotenv/config";

const provider = new RpcProvider({
  nodeUrl: process.env.NODE_URL,
  chainId: "0x534e5f5345504f4c4941",
  headers: {
    "x-apikey": process.env.API_KEY,
  },
});

const account = new Account(
  provider,
  process.env.ACCOUNT_ADDRESS_SEPOLIA,
  process.env.ACCOUNT_PRIVATE_KEY_SEPOLIA,
  undefined,
  constants.TRANSACTION_VERSION.V3
);

export { provider, account };
