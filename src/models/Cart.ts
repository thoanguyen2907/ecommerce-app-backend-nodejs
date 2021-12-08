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
      popular: {
        type: Boolean,
      },
      newArrival: {
        type: Boolean,
      }
  },
  product: {
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
      popular: {
        type: Boolean,
      },
      newArrival: {
        type: Boolean,
      }
  },
  quantity: {
  type: Number
}
})




export default mongoose.model<CartDocument>('carts', cartSchema)
