export type PrivateInputs = {
  private_inputs: {
    customer_id: string,
    customer_secret: string
    authorized_sender: string,
  }
}

export type PolicyInputs = {
  policy: {
    id: string,
    scope: {
      id: string,
      parameters: Record<string, string | number | boolean>
    }
  }
}

export type CommitmentInputs = PrivateInputs & PolicyInputs

type RequestInputs = {
  request: {
    sender: string,
    commitment: string
  }
}

export type PublicInputs = PolicyInputs & RequestInputs;

export type Inputs = PrivateInputs & PublicInputs
