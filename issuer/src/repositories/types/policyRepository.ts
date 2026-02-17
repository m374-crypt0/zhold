export type Policy = {
  id: number,
  assetName: string,
  scope: {
    name: string,
    validityMode: string
  }
}

export type PolicyRepository = {
  listIdentifiers: () => Array<number>
  getFromId: (id: number) => Policy | undefined
}

