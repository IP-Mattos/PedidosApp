import mongoose, { Schema, Document } from 'mongoose'

// Define la interfaz para los cheques
interface ICheque {
  chequeName: string
  chequeAmount: number
  chequePhoneNumber: number
  deliveryDate: Date
  expiryDate: Date
}

// Define la interfaz para el cajero
interface ICashier extends Document {
  name: string
  surname: string // Campo para el apellido
  totalAmount: number
  date: Date // Fecha del registro
  dollars?: number
  cheques?: ICheque[]
  counter: string // Campo para el contador
}

// Define el esquema para los cheques
const ChequeSchema = new Schema<ICheque>({
  chequeName: { type: String, required: true },
  chequePhoneNumber: { type: Number },
  chequeAmount: { type: Number, required: true },
  deliveryDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true }
})

// Define el esquema para el cajero
const CashierSchema = new Schema<ICashier>({
  name: { type: String, required: true },
  surname: { type: String, required: true }, // Campo para el apellido
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: () => new Date() }, // Fecha actual en UTC
  dollars: { type: Number },
  cheques: { type: [ChequeSchema], default: [] },
  counter: { type: String, required: true } // Campo para el contador
})

// Crear un documento con la fecha en UTC
const createCashier = async (data: ICashier) => {
  const newCashier = new Cashier(data) // Usa los datos tal como son

  await newCashier.save()
}

// Crea el modelo si no existe ya
const Cashier = mongoose.models.Cashier || mongoose.model<ICashier>('Cashier', CashierSchema)

export default Cashier
export { createCashier }
