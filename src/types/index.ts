export interface Cheque {
  chequeName: string
  chequePhoneNumber: number
  chequeAmount: number | null
  deliveryDate: Date | null
  expiryDate: Date | null
}

export interface Egreso {
  _id: string
  totalAmount: number | null
  dollars: number | null
  name: string
  date: string
  counter: string
  cheques: Cheque[]
}
