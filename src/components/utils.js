import { RpcProvider } from "starknet";
import "dotenv/config";

const provider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_NODE_URL,
  chainId: "0x534e5f5345504f4c4941",
  headers: {
    "x-apikey": process.env.NEXT_PUBLIC_API_KEY,
  },
});

const convertWeiToEth = (wei) => (wei ? Number(wei) / 10 ** 18 : null);

export { provider, convertWeiToEth };
