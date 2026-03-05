import {
  type CreateCommitmentOptions,
  type PrivateInputs,
  type PublicInputs
} from "src/types";

import customer from "src"

import { Barretenberg } from "@aztec/bb.js";

import { bytesToHex } from "viem";

import { beforeEach, describe, expect, it, } from "bun:test";

describe('Commitment creation', () => {
  let bb: Barretenberg

  const ZERO_COMMITMENT_OPTIONS = {
    customerId: 0,
    authorizedSender: 0n,
    customerSecret: 0n,
    policy: {
      id: 0,
      scope: {
        id: 0,
        parameters: {
          validUntil: 0
        }
      }
    }
  } as const

  beforeEach(async () => {
    bb = await Barretenberg.new()
  })

  it('should be able to create a poseidon2 commitment from input', async () => {

    const expectedCommitment = (await bb.poseidon2Hash({
      inputs: [
        (await bb.blake2sToField({ data: Buffer.from([ZERO_COMMITMENT_OPTIONS.customerId]) })).field,
        (await bb.blake2sToField({ data: Buffer.from(ZERO_COMMITMENT_OPTIONS.customerSecret.toString()) })).field,
        (await bb.blake2sToField({ data: Buffer.from(ZERO_COMMITMENT_OPTIONS.authorizedSender.toString()) })).field,
        (await bb.blake2sToField({ data: Buffer.from([ZERO_COMMITMENT_OPTIONS.policy.id]) })).field,
        (await bb.blake2sToField({ data: Buffer.from([ZERO_COMMITMENT_OPTIONS.policy.scope.id]) })).field,
        (await bb.blake2sToField({ data: Buffer.from((ZERO_COMMITMENT_OPTIONS.policy.scope.parameters.validUntil as number).toString()) })).field,
      ]
    })).hash

    const commitment = await customer.createCommitment(ZERO_COMMITMENT_OPTIONS)

    expect(commitment).toBe(bytesToHex(expectedCommitment))
  })

  it('should be able to create a proof and verify it against wrong inputs', async () => {
    const privateInputs: PrivateInputs = {
      customerId: ZERO_COMMITMENT_OPTIONS.customerId,
      authorizedSender: ZERO_COMMITMENT_OPTIONS.authorizedSender,
      customerSecret: ZERO_COMMITMENT_OPTIONS.customerSecret
    }

    const commitment = await customer.createCommitment(ZERO_COMMITMENT_OPTIONS)

    const proof = await customer.generateProof(privateInputs)

    const publicInputs: PublicInputs = {
      policy: { ...ZERO_COMMITMENT_OPTIONS.policy },
      sender: 0n,
      currentTimestamp: 0,
      commitment
    }

    expect(await customer.verifyProof(proof, publicInputs)).toBeFalse()
  })

  // it('should be able to create a valid proof from ...', async () => {
  //   const data: CreateCommitmentOptions = {
  //     customerId: 0,
  //     authorizedSender: 0n,
  //     customerSecret: 0n,
  //     policy: {
  //       id: 0,
  //       scope: {
  //         id: 0,
  //         parameters: {
  //           validUntil: 0
  //         }
  //       }
  //     }
  //   }

  //   const proof = await customer.generateProof(data)

  //   expect(customer.verifyProof(proof, data)).toBeTrue()
  // })
})
