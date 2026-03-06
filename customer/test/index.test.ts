import {
  type PrivateInputs,
  type PublicInputs
} from "src/types";

import customer from "src";

import { poseidon2HashAsync } from "@zkpassport/poseidon2";

import { randomBytes } from "crypto"

import { BN254_FR_MODULUS } from "@aztec/bb.js"

import { describe, expect, it, } from "bun:test";

describe('Commitment creation', () => {

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

  it('should be able to create a poseidon2 commitment from input', async () => {
    const expectedCommitment = await poseidon2HashAsync([
      BigInt(ZERO_COMMITMENT_OPTIONS.customerId),
      ZERO_COMMITMENT_OPTIONS.customerSecret,
      ZERO_COMMITMENT_OPTIONS.authorizedSender,
      BigInt(ZERO_COMMITMENT_OPTIONS.policy.id),
      BigInt(ZERO_COMMITMENT_OPTIONS.policy.scope.id),
      BigInt(ZERO_COMMITMENT_OPTIONS.policy.scope.parameters.validUntil as number)
    ])

    const commitment = await customer.createCommitment(ZERO_COMMITMENT_OPTIONS)

    expect(commitment).toBe(expectedCommitment)
  })

  it('should not be able to create a proof with wrong inputs', async () => {
    const privateInputs: PrivateInputs = {
      customerId: ZERO_COMMITMENT_OPTIONS.customerId,
      authorizedSender: ZERO_COMMITMENT_OPTIONS.authorizedSender,
      customerSecret: ZERO_COMMITMENT_OPTIONS.customerSecret
    }

    const publicInputs: PublicInputs = {
      policy: { ...ZERO_COMMITMENT_OPTIONS.policy },
      sender: 0n,
      currentTimestamp: 0,
      commitment: 1n
    }

    expect(async () => await customer.generateProof({ ...privateInputs, ...publicInputs }))
      .toThrowError('Circuit execution failed: Invalid commitment value')
  })

  it('should be able to create a proof and verify it against correct inputs', async () => {
    const customerSecret = BigInt(`0x${randomBytes(32).toString('hex')}`) % BN254_FR_MODULUS

    const privateInputs: PrivateInputs = {
      customerId: ZERO_COMMITMENT_OPTIONS.customerId,
      authorizedSender: 0x1B77B138c7706407ad86438b75D8bA9F9c838A49n,
      customerSecret
    }

    const policy = {
      id: 0,
      scope: {
        id: 0,
        parameters: {
          validUntil: 1770380983
        }
      }
    }

    const commitment = await customer.createCommitment({
      ...privateInputs,
      policy
    })

    const publicInputs: PublicInputs = {
      policy,
      sender: privateInputs.authorizedSender,
      currentTimestamp: policy.scope.parameters.validUntil - 1,
      commitment
    }

    const proof = await customer.generateProof({ ...privateInputs, ...publicInputs })

    expect(await customer.verifyProof(proof, publicInputs)).toBeTrue()
  })
})
