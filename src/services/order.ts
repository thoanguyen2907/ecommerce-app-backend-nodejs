import { ProductInCart } from './../models/Order'
import Order, { OrderDocument } from '../models/Order'
import { NotFoundError } from '../helpers/apiError'

const create = async (order: OrderDocument): Promise<OrderDocument> => {
  return order.save()
}
// const updateQuantityProductOrder = (productList:  ProductInCart[],  indexProductOrder: number,
//   order: OrderDocument): Promise<OrderDocument> => {
//   if(productList[indexProductOrder].quantity) {
//     productList[indexProductOrder].quantity += 1
//     //  console.log( productList[indexProductOrder].quantity)
     
//   }
//   return order.save()

//}

const findById = async (orderId: string): Promise<OrderDocument> => {

  const foundOrder = await Order.findById(orderId).populate({path: 'users'}).populate({path: 'products.product'})

  if (!foundOrder) {
    throw new NotFoundError(`order ${orderId} not found`)
  }

  return foundOrder
}

const findAll = async (query: any): Promise<OrderDocument[]> => {

  const queryFind = {...query}
   let find: any, select: any, sort: any
  const removeFields = ['select', 'sort','page','limit']
  removeFields.forEach(param => delete queryFind[param])
  
  let queryStr = JSON.stringify(queryFind)
  //replace symbol with $
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, find => `$${find}`)
  //parse
  find = JSON.parse(queryStr)

  if(query.select) {
    select = query.select.split(',').join(' ')
  }
  if(query.sort) {
    sort = query.sort.split(',').join(' ')
} 
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  const skip = (page-1)*limit
  return Order.find(find).populate({path: 'user'}).populate({path: 'products.product'}).select(select).sort(sort).skip(skip).limit(limit)
}

const update = async (
  orderId: string,
  update: Partial<OrderDocument>
): Promise<OrderDocument | null> => {
  const foundOrder = await Order.findByIdAndUpdate(orderId, update, {
    new: true,
  })

  if (!foundOrder) {
    throw new NotFoundError(`Order ${orderId} not found`)
  }

  return foundOrder
}
const updateQuantityProductOrder = async (
  orderId: string
): Promise<OrderDocument | null> => {
  return await Order.findByIdAndUpdate(orderId, {$inc: {'products.quantity': 1}}, {
    new: true,
  })
}

const deleteOrder = async (
  orderId: string
): Promise<OrderDocument | null> => {
  const foundOrder = Order.findByIdAndDelete(orderId)

  if (!foundOrder) {
    throw new NotFoundError(`Order ${orderId} not found`)
  }

  return foundOrder
}

const increaseQuant = async (orderId: any): Promise<OrderDocument | null | undefined>  => { 
      return await Order.findByIdAndUpdate(orderId, {$inc: {'products.quantity': 1}}, {new: true }).populate({path: 'users'}).populate({path: 'products.products'})

    }
 const decreaseQuant = async (orderId: any): Promise<OrderDocument | null | undefined>  => { 
  return await Order.findByIdAndUpdate(orderId, {$inc: {'products.quantity': -1}}, {new: true }).populate({path: 'users'}).populate({path: 'products.products'})

}

const getOrderByUserId = async (userId: any): Promise<OrderDocument[]> => {
  return await Order.find({'user': userId}).populate({path: 'user'}).populate({path: 'products.product'})
}




export default {
  create,
  findById,
  findAll,
  update,
  deleteOrder,
  increaseQuant,
  decreaseQuant,
  getOrderByUserId,
  updateQuantityProductOrder
}
