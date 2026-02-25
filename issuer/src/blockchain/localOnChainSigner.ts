import abi from "contracts/out/CommitmentStore.sol";
import { contractAddresses } from "src/blockchain/utility/contractAddresses";
import {
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  createPublicClient,
  createWalletClient,
  defineChain,
  http
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { anvil } from "viem/chains";
import type { OnChainSigner } from "./types/onChainSigner";

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

  public async storeCommitment(commitment: string) {
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
        functionName: 'commit',
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

  private privateKey: PrivateKey
}
