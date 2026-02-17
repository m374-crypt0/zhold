import { type CustomerRepository, type KYCData, type Customer } from './types/customerRepository'

export const inMemoryCustomerRepository: CustomerRepository = {
  register(kycData: KYCData) {
    const id = nextCustomerId()

    repository.push({ ...kycData, id })

    return id
  },
  exists(kycData: KYCData) {
    return repository.some(customer =>
      customer.email === kycData.email &&
      customer.firstName === kycData.firstName &&
      customer.lastName === kycData.lastName)
  }
}

const repository: Array<Customer> = []

function nextCustomerId() {
  return repository.length
}
