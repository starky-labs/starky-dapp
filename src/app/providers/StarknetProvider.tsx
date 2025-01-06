/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { sepolia, mainnet, Chain } from "@starknet-react/chains";
import { Connector, StarknetConfig, voyager } from "@starknet-react/core";
import type { PropsWithChildren } from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { RpcProvider } from 'starknet';
import * as gameContract from "@/contracts/game";
import * as ethContract from "@/contracts/eth";

function provider(chain: Chain) {
  switch (chain) {
    case mainnet:
      return new RpcProvider({
        nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet',
      })
    case sepolia:
    default:
      return new RpcProvider({
        nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
      })
  }
}

const connector = new ControllerConnector({
  policies: [
    {
      target: ethContract.address,
      method: 'approve',
      description: 'Approve to Starky contract to transfer ETHER on your behalf.',
    },
    {
      target: gameContract.address,
      method: 'place_bet',
    },
  ],
  rpc: "https://api.cartridge.gg/x/starknet/sepolia",
})

export function StarknetProvider({ children }: PropsWithChildren) {
  return (
    <StarknetConfig
      autoConnect
      chains={[mainnet, sepolia]}
      connectors={[connector as never as Connector]}
      explorer={voyager}
      provider={provider}
    >
      {children}
    </StarknetConfig>
  )
}