/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  user: string,
  product:  string,
  quantity?:  number
}

const orderSchema = new mongoose.Schema({
  user: {
    ref: 'users',
    type: mongoose.Schema.Types.ObjectId
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'products'
  },
  quantity: {
  type: Number
}
})

orderSchema.virtual('users', {
	ref: 'users', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'orders', // is equal to foreignField
 })


export default mongoose.model<OrderDocument>('orders', orderSchema)
