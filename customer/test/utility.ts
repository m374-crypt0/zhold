import { randomBytes } from "crypto";

import { BN254_FR_MODULUS } from "@aztec/bb.js";

import type {
  PrivateInputs,
  PublicInputs
} from "src/types";

import customer from "src";

export async function getValidProofForTesting(options: {
  privateInputs: {
    customer_id: string,
    customer_secret: string,
    authorized_sender: string
  },
  publicInputs: {
    policy: {
      id: string,
      scope: {
        id: string,
        parameters: Record<string, string | number | boolean>
      }
    },
    request: {
      sender: string,
      commitment: string
    }
  }
}) {

  const private_inputs: PrivateInputs = {
    private_inputs: { ...options.privateInputs }
  }

  const public_inputs: PublicInputs = { ...options.publicInputs }

  return await customer.generateProof({ ...private_inputs, ...public_inputs })
}

export async function getTestingPublicInputs() {
  return {
    policy: getTestingPolicy(),
    request: await getTestingRequest()
  }
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

export function createCustomerSecret() {
  // NOTE: ensuring the secret holds in a Field value
  const customerSecret = BigInt(`0x${randomBytes(32).toString('hex')}`) % BN254_FR_MODULUS

  return customerSecret.toString()
}

function getTestingCustomerId() {
  return '0';
}

function getTestingSender() {
  return '0x0000000000000000000000000000000000000001'
}

async function getTestingCommitment() {
  return `0x${(await customer.createCommitment({
    private_inputs: { ...getTestingPrivateInputs() },
    policy: { ...getTestingPolicy() }
  })).toString(16)}`
}

async function getTestingRequest() {
  return {
    sender: getTestingSender(),
    commitment: await getTestingCommitment()
  }
}

function getTestingCustomerSecret() {
  return '2'
}
