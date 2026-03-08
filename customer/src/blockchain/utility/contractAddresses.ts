import broadcast from "contracts/broadcast/LocalDeploy.s.sol/1/run-latest.json"

type Address = `0x${string}`

export const contractAddresses = {
  Prover: broadcast.transactions
    .filter(tx => tx.contractName === 'Prover')
    .map(tx => tx.contractAddress)
    .at(0) as Address,
} as const

