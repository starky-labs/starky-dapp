/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { sepolia, mainnet, Chain } from "@starknet-react/chains";
import { Connector, StarknetConfig, voyager } from "@starknet-react/core";
import type { PropsWithChildren } from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { RpcProvider } from 'starknet';
import { ETH_ERC20_CONTRACT, GAME_CONTRACT,  } from "@/app/constants";

const InfuraRPC = `https://starknet-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`

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
      target: ETH_ERC20_CONTRACT,
      method: 'approve',
      description: 'Approve to Starky contract to transfer ETHER on your behalf.',
    },
    {
      target: GAME_CONTRACT,
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