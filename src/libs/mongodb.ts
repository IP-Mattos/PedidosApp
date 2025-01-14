import mongoose from 'mongoose'

const MONGO_URL = 'mongodb+srv://lofierro:LoFierro.guh.slq.mongojaja@cluster0.rvsvp0c.mongodb.net/egreso'

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URL)
    console.log('Conectado')
  } catch (error) {
    console.log(error)
  }
}
