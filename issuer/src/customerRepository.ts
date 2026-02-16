export type KYCData = {
  firstName: string,
  lastName: string,
  email: string
}

export type Customer = KYCData & { id: number }

export type CustomerRepository = {
  register: (kycData: KYCData) => number,
  exists: (kycData: KYCData) => boolean
}

