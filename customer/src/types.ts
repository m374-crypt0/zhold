export type PrivateInputs = {
  customerId: number,
  customerSecret: bigint
  authorizedSender: bigint,
}

export type PolicyInputs = {
  policy: {
    id: number,
    scope: {
      id: number,
      parameters: {
        [name: string]: unknown
      }
    }
  }
}

export type CreateCommitmentOptions = PrivateInputs & PolicyInputs

type DynamicInputs = {
  sender: bigint,
  currentTimestamp: number,
  commitment: bigint
}

export type PublicInputs = PolicyInputs & DynamicInputs;

export type Proof = {};
