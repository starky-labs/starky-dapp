/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { sepolia, mainnet, } from "@starknet-react/chains";
import { Connector, StarknetConfig, voyager, cartridgeProvider } from "@starknet-react/core";
import type { PropsWithChildren } from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { constants } from 'starknet';
import * as gameContract from "@/contracts/game";
import * as ethContract from "@/contracts/eth";

const sepoliaWithRpc = {
  ...sepolia,
  rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia"
};

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
  chains: [sepoliaWithRpc],
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
})

export function StarknetProvider({ children }: PropsWithChildren) {
  return (
    <StarknetConfig
      autoConnect
      chains={[mainnet, sepolia]}
      connectors={[connector as never as Connector]}
      explorer={voyager}
      provider={cartridgeProvider()}
    >
      {children}
    </StarknetConfig>
  )
}