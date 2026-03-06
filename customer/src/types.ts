export type PrivateInputsForBackend = {
  private_inputs: {
    customer_id: string,
    customer_secret: string
    authorized_sender: string,
  }
}

export type PolicyInputsForBackend = {
  policy: {
    id: string,
    scope: {
      id: string,
      parameters: Record<string, string | number | boolean>
    }
  }
}

export type CommitmentInputForBackend = PrivateInputsForBackend & PolicyInputsForBackend

type RequestInputs = {
  request: {
    sender: string,
    current_timestamp: string,
    commitment: string
  }
}

export type PublicInputsForBackend = PolicyInputsForBackend & RequestInputs;

export type InputsForBackend = PrivateInputsForBackend & PublicInputsForBackend
