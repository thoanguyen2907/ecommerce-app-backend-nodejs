/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type ProductDocument = Document & {
  id: string,
  name: string,
	price: string,
	description: string,
  dislike?: number,
	like?: number,
	brand: string,
	size: [string],
	color: [string],
  category: string,
  productImg: string,
  virtualImg: string,
  popular: boolean,
  newArrival: boolean
}

const productSchema = new mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true,
    index: true,
  },

  category: {
      ref: 'category',
      type: String
  },
  description: {
    type: String,
    index: true,
  },
  brand: {
    type: String,
    required: true,
    index: true,
  },
  size: {
    type: [String],
    required: true,
    index: true,
  },
  color: {
    type: [String],
    required: true,
    index: true,
  },
  price: {
    type: Number,
    required: true
  },
  dislike: {
    type: Number,
  },
  like: {
    type: Number,
  },
  productImg: {
    type: String,
    index: true,
  },
  virtualImg: {
    type: String,
    index: true,
  },
  popular: {
    type: Boolean,
  },
  newArrival: {
    type: Boolean,
  }
}
)

productSchema.virtual('orders', {
	ref: 'orders', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'product', // is equal to foreignField
 })


// Set Object and Json property to true. Default is set to false
productSchema.set('toObject', { virtuals: true })
productSchema.set('toJSON', { virtuals: true })

export default mongoose.model<ProductDocument>('products', productSchema)
