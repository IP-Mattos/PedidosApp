import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export interface IUser {
  _id: ObjectId | string | undefined
  nombre: string
  apellido: string
  email: string
  password: string
  rol?: 'admin' | 'contador' | 'user'
  createdAt?: string
  updatedAt?: string
}

export interface IUserSchema extends Document {
  _doc: { [x: string]: any; password: any }
  _id: ObjectId | string | undefined
  nombre: string
  apellido: string
  email: string
  password: string
  rol: 'admin' | 'contador' | 'user'
  createdAt?: string
  updatedAt?: string
}

const IUserSchema: Schema = new Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    apellido: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    rol: {
      type: String,
      enum: ['admin', 'contador'],
      default: 'contador'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const User = mongoose.models.User || mongoose.model('User', IUserSchema)

export default User
