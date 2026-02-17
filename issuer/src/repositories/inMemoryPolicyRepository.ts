import { type PolicyRepository, type Policy } from './types/policyRepository'

export const inMemoryPolicyRepository: PolicyRepository = {
  listIdentifiers() {
    return repository.map(policy => policy.id)
  },
}

const repository: Array<Policy> = [{
  id: 0
}]
