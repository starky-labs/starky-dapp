import { RpcProvider } from "starknet";
import "dotenv/config";

const provider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_NODE_URL,
  headers: {
    "x-apikey": process.env.NEXT_PUBLIC_API_KEY,
  },
});

const convertWeiToEth = (wei) => (wei ? Number(wei) / 10 ** 18 : null);

export { provider, convertWeiToEth };
