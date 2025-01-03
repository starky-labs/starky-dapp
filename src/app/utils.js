import { RpcProvider, Account } from "starknet";
import "dotenv/config";

const provider = new RpcProvider({
  nodeUrl: process.env.NODE_URL,
  headers: {
    "x-apikey": process.env.API_KEY,
  }
});

const account = new Account(provider, process.env.ACCOUNT_ADDRESS_SEPOLIA, process.env.ACCOUNT_PRIVATE_KEY_SEPOLIA);

export { provider, account };
