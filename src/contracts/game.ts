export const gameAddress =
  "0x02c27b6caba176944a66319d051535b42e75df95179b3a6c9347533d04370088";

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
        ],
        outputs: [],
        state_mutability: "external",
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
    ],
  },
] as const;
