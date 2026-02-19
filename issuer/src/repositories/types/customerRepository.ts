export type KYCData = {
  firstName: string,
  lastName: string,
  email: string
}

export type Customer = KYCData & { id: number }

export type CustomerRepository = {
  register: (kycData: KYCData) => number,
  isAlreadyRegistered: (kycData: KYCData) => boolean,
  exists: (id: number) => boolean
}

