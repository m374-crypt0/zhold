export type Policy = {
  id: number,
  assetName: string,
  scope: {
    name: string,
    parameters: Record<string, any>
  }
  validateParameters: (parameters: Record<string, any>) => boolean,
  validateParameterValues: (parameters: Record<string, any>) => boolean
}

export type PolicyRepository = {
  listIdentifiers: () => Array<number>
  getFromId: (id: number) => Policy | undefined
}

