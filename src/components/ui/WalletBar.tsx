"use client";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useMemo } from "react";

function WalletConnected() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  console.log({address});

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <div>
      <div>
        <span>Connected: {shortenedAddress}</span>
      </div>
      <button
        className="bg-yellow-300 border border-black hover:bg-yellow-500 text-black font-regular py-2 px-4 rounded transition-all"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}

function ConnectWallet() {
  const { connectors, connect } = useConnect();
  const cartridgeConnector = connectors[0];

  return (
    <div>
      <span className="text-lg text-gray-800 font-semibold">
        Choose a wallet:{" "}
      </span>
      {connectors.map((connector) => {
        return (
          <button
            key={connector.id}
            onClick={() => connect({ connector: cartridgeConnector })}
            className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 active:bg-blue-700 transition-all"
          >
            {connector.id}
          </button>
        );
      })}
    </div>
  );
}

export default function WalletBar() {
  const { address } = useAccount();

  return address ? <WalletConnected /> : <ConnectWallet />;
}
