/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'
type ProductInCart = {
  product: string,
  quantity?:  number
}

export type OrderDocument = Document & {
  user: string,
  products:  ProductInCart
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
    }
   },

})

orderSchema.virtual('users', {
	ref: 'users', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'orders', // is equal to foreignField
 })


export default mongoose.model<OrderDocument>('orders', orderSchema)
