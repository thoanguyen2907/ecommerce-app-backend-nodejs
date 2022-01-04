import { ProductDocument } from './Product'
import { UserDocument } from './User'
/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'


export type CartDocument = Document & {
  user: UserDocument,
  product:  ProductDocument,
  quantity?:  number
}

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  product: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
    }
,
  quantity: {
  type: Number
}
})




export default mongoose.model<CartDocument>('carts', cartSchema)
