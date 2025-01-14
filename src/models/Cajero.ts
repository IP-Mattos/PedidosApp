import mongoose, { Schema, Document } from 'mongoose'

interface ICajero extends Document {
  name: string
  surname: string
  telefono: string
}

const CajeroSchema = new Schema<ICajero>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  telefono: { type: String, required: true }
})

const Cajero = mongoose.models.Cajero || mongoose.model<ICajero>('Cajero', CajeroSchema)

export default Cajero
