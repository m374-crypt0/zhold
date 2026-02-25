import { ContractFunctionExecutionError, ContractFunctionRevertedError, createPublicClient, createWalletClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { anvil } from "viem/chains";
import type { OnChainSigner } from "./types/onChainSigner";
import { contractAddresses } from "src/blockchain/utility/createConstantModules"

// import { abi } from "contracts/out/CommitmentStore.sol/CommitmentStore.json"
const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "pfop_",
        "type": "address",
        "internalType": "contract IPrimeFieldOrderProvider"
      },
      {
        "name": "owner_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "commit",
    "inputs": [
      {
        "name": "commitment_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "commitments",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "primeFieldOrderProvider",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IPrimeFieldOrderProvider"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "revoke",
    "inputs": [
      {
        "name": "commitment_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "CommitmentRevoked",
    "inputs": [
      {
        "name": "commitment_",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CommitmentStored",
    "inputs": [
      {
        "name": "commitment_",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "CommitmentPrimeFieldOrderOverflow",
    "inputs": []
  },
  {
    "type": "error",
    "name": "DuplicateCommitment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidZeroCommitment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const

export type PrivateKey = `0x${string}`
type Hash = `0x${string}`

export class LocalOnChainSigner implements OnChainSigner {
  constructor(privateKey: PrivateKey) {
    this.privateKey = privateKey
  }

  public async revokeCommitment(commitment: string) {
    const clientConfig = {
      chain: defineChain({
        ...anvil,
        id: 1
      }),
      transport: http()
    }
    const publicClient = createPublicClient(clientConfig)
    const walletClient = createWalletClient(clientConfig)
    const account = privateKeyToAccount(this.privateKey)

    let transactionHash: Hash

    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddresses.CommitmentStore,
        abi,
        functionName: 'revoke',
        args: [BigInt(commitment)],
        account
      })

      transactionHash = await walletClient.writeContract(request)
    } catch (e) {
      const executionError = e as ContractFunctionExecutionError
      const revertedError = executionError.cause as ContractFunctionRevertedError

      throw new Error(revertedError.data?.errorName)
    }

    return transactionHash
  }

  public storeCommitment(commitment: string) {
    return Promise.reject('not implemented')
  }

  private privateKey: PrivateKey
}
