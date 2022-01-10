/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'
import { ProductDocument } from './Product'
export type ProductInCart = {
  product: ProductDocument,
  quantity:  number,
  size: string,
  color: string
}

export type OrderDocument = Document & {
  user: string,
  products:  ProductInCart, 
  create_at: Date
}

const orderSchema = new mongoose.Schema({
  user: {
    ref: 'users',
    type: mongoose.Schema.Types.ObjectId
  },
  products: {
    product: {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'products'
    },
    quantity: {
      type: Number,
      default: 1
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
   }, 
   create_at: {
    type: Date,
    required: true,
   }

})

orderSchema.virtual('users', {
	ref: 'users', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'orders', // is equal to foreignField
 })


export default mongoose.model<OrderDocument>('orders', orderSchema)
