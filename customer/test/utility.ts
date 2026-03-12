import { randomBytes } from "crypto";

import { BN254_FR_MODULUS } from "@aztec/bb.js";

import type {
  CommitmentInputs,
  PolicyInputs,
  PrivateInputs,
  PublicInputs
} from "src/types";

import customer from "src";

export const ZERO_COMMITMENT_OPTIONS: CommitmentInputs = {
  private_inputs: {
    customer_id: 0n.toString(),
    authorized_sender: 0n.toString(),
    customer_secret: 0n.toString(),
  },
  policy: {
    id: 0n.toString(),
    scope: {
      id: 0n.toString(),
      parameters: {
        valid_until: 0n.toString()
      }
    }
  }
}

export async function getValidProofAndPublicInputs(privateInputs: {
  customer_id: string,
  customer_secret: string,
  authorized_sender: string
} = getTestingPrivateInputs()) {

  const private_inputs: PrivateInputs = {
    private_inputs: { ...privateInputs }
  }

  const policy: PolicyInputs = { policy: { ...getTestingPolicy() } }

  // TODO: rename to PublicInputsForVerifier
  const publicInputs: PublicInputs = {
    ...policy,
    request: { ...await getTestingRequest() }
  }

  const proof = await customer.generateProof({ ...private_inputs, ...publicInputs })

  return { proof, publicInputs };
}

export function createCustomerSecret() {
  // NOTE: ensuring the secret holds in a Field value
  const customerSecret = BigInt(`0x${randomBytes(32).toString('hex')}`) % BN254_FR_MODULUS

  return customerSecret.toString()
}

export function getTestingCustomerId() {
  return '0';
}

export function getTestingSender() {
  return '0x0000000000000000000000000000000000000001'
}

export function getTestingPolicy() {
  return {
    id: '0',
    scope: {
      id: '0',
      parameters: {
        valid_until: 1
      }
    }
  }
}

export function getTestingPrivateInputs() {
  return {
    customer_id: getTestingCustomerId(),
    authorized_sender: getTestingSender(),
    customer_secret: getTestingCustomerSecret()
  }
}

export async function getTestingCommitment() {
  return `0x${(await customer.createCommitment({
    private_inputs: { ...getTestingPrivateInputs() },
    policy: { ...getTestingPolicy() }
  })).toString(16)}`
}

export async function getTestingRequest() {
  return {
    sender: getTestingSender(),
    commitment: await getTestingCommitment()
  }
}

export function getTestingCustomerSecret() {
  return '2'
}
