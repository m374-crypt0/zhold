export type Policy = {
  id: number,
  assetName: string,
  scope: {
    name: string,
    parameters: Record<string, any>
  }
}

export type PolicyRepository = {
  listIdentifiers: () => Array<number>
  getFromId: (id: number) => Policy | undefined
}

