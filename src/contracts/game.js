export const address =
  "0x004292cf51643c77b38725be0a543907c40aaad659031520f43dd0920f401413";

export const abi = [
  {
    name: "BettingContract",
    type: "impl",
    interface_name: "betting_game::betting_game::IBettingContract",
  },
  {
    name: "core::integer::u256",
    type: "struct",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    name: "betting_game::betting_game::IBettingContract",
    type: "interface",
    items: [
      {
        name: "get_prize_pool",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_user_points",
        type: "function",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "place_bet",
        type: "function",
        inputs: [
          {
            name: "bet_amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "transfer_prize",
        type: "function",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "tx_hash",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "currency",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "fee_collector_address",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    name: "constructor",
    type: "constructor",
    inputs: [
      {
        name: "initial_backend_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "currency",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "fee_collector_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "struct",
    name: "betting_game::betting_game::BettingContract::BetPlaced",
    type: "event",
    members: [
      {
        kind: "data",
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "amount",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "points_earned",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "fee_amount",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "struct",
    name: "betting_game::betting_game::BettingContract::PrizeTransferred",
    type: "event",
    members: [
      {
        kind: "data",
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "amount",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "timestamp",
        type: "core::integer::u64",
      },
      {
        kind: "data",
        name: "tx_hash",
        type: "core::felt252",
      },
    ],
  },
  {
    kind: "struct",
    name: "betting_game::betting_game::BettingContract::PlatformFeeCollected",
    type: "event",
    members: [
      {
        kind: "data",
        name: "fee_collector",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "amount",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "enum",
    name: "betting_game::betting_game::BettingContract::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "BetPlaced",
        type: "betting_game::betting_game::BettingContract::BetPlaced",
      },
      {
        kind: "nested",
        name: "PrizeTransferred",
        type: "betting_game::betting_game::BettingContract::PrizeTransferred",
      },
      {
        kind: "nested",
        name: "PlatformFeeCollected",
        type: "betting_game::betting_game::BettingContract::PlatformFeeCollected",
      },
    ],
  },
];
