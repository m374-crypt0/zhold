import { type PolicyRepository, type Policy } from './types/policyRepository'

export const inMemoryPolicyRepository: PolicyRepository = {
  listIdentifiers() {
    return repository.map(policy => policy.id)
  },
  getFromId(id) {
    return repository.find(p => p.id === id)
  },
}

const repository: Array<Policy> = [{
  id: 0,
  assetName: 'RWA_GOLD_ONE_OUNCE',
  scope: {
    name: 'HOLD',
    parameters: {
      validUntil: {
        description: 'A UNIX timestamp value with second precision'
      }
    },
  },
  validateParameters: (parameters) => {
    return parameters['validUntil'] !== undefined
  }
}]
