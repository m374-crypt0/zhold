export type PrivateInputs = {
  customer_id: string,
  customer_secret: string
  authorized_sender: string,
}

export type PolicyInputs = {
  id: string,
  scope: {
    id: string,
    parameters: Record<string, string | number | boolean>
  }
}

export type CommitmentInputs = {
  private_inputs: PrivateInputs,
  policy: PolicyInputs
}

type RequestInputs = {
  sender: string,
  commitment: string
}

export type PublicInputs = {
  policy: PolicyInputs,
  request: RequestInputs
};

export type Inputs = {
  private_inputs: PrivateInputs,
} & PublicInputs
