import abi from "contracts/out/CommitmentStore.sol";
import { contractAddresses } from "src/blockchain/utility/contractAddresses";
import {
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  type PublicClient,
  type WalletClient
} from "viem";
import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";
import { anvil } from "viem/chains";
import type { OnChainSigner } from "./types/onChainSigner";

export type PrivateKey = `0x${string}`
type Hash = `0x${string}`

export class LocalOnChainSigner implements OnChainSigner {
  constructor(privateKey: PrivateKey) {
    const clientConfig = {
      chain: defineChain({
        ...anvil,
        id: 1
      }),
      transport: http()
    }

    this.publicClient = createPublicClient(clientConfig)
    this.walletClient = createWalletClient(clientConfig)
    this.account = privateKeyToAccount(privateKey)
  }

  public async revokeCommitment(commitment: string) {
    let transactionHash: Hash

    try {
      const { request } = await this.publicClient.simulateContract({
        address: contractAddresses.CommitmentStore,
        abi,
        functionName: 'revoke',
        args: [BigInt(commitment)],
        account: this.account
      })

      transactionHash = await this.walletClient.writeContract(request)
    } catch (e) {
      const executionError = e as ContractFunctionExecutionError
      const revertedError = executionError.cause as ContractFunctionRevertedError

      throw new Error(revertedError.data?.errorName)
    }

    return transactionHash
  }

  public async storeCommitment(commitment: string) {
    let transactionHash: Hash

    try {
      const { request } = await this.publicClient.simulateContract({
        address: contractAddresses.CommitmentStore,
        abi,
        functionName: 'commit',
        args: [BigInt(commitment)],
        account: this.account
      })

      transactionHash = await this.walletClient.writeContract(request)
    } catch (e) {
      const executionError = e as ContractFunctionExecutionError
      const revertedError = executionError.cause as ContractFunctionRevertedError

      throw new Error(revertedError.data?.errorName)
    }

    return transactionHash
  }

  private readonly publicClient: PublicClient
  private readonly walletClient: WalletClient
  private readonly account: PrivateKeyAccount
}
