import { type CustomerRepository, type KYCData, type Customer } from './types/customerRepository'

export const inMemoryCustomerRepository: CustomerRepository = {
  register(kycData: KYCData) {
    const id = nextCustomerId()

    repository.push({ ...kycData, id })

    return id
  },
  isAlreadyRegistered(kycData: KYCData) {
    return repository.some(customer => customer.email === kycData.email &&
      customer.firstName === kycData.firstName &&
      customer.lastName === kycData.lastName)
  },
  exists: function (id: number): boolean {
    return repository.some(customer => customer.id === id)
  }
}

export function clearRepository() {
  repository.length = 0
}

const repository: Array<Customer> = []

function nextCustomerId() {
  return repository.length
}
