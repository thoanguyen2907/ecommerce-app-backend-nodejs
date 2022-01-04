import Product, { ProductDocument } from '../models/Product'
import { NotFoundError } from '../helpers/apiError'


const create = async (product: ProductDocument): Promise<ProductDocument> => {
  return product.save()
}

const findById = async (productId: string): Promise<ProductDocument> => {

  const foundProduct = await Product.findById(productId)

  if (!foundProduct) {
    throw new NotFoundError(`product ${productId} not found`)
  }

  return foundProduct
}
const findByCategoryId = async (params: any): Promise<ProductDocument[]> => {
  const categoryId = (params.categoryId) ? params.categoryId : ''
  params = (params.categoryId) ? params.query : params
  const queryFind = {...params}
  let select: any, sort: any
  const removeFields = ['select', 'sort','page','limit']
  removeFields.forEach(param => delete queryFind[param])
  
  //select fields 
  let queryStr = JSON.stringify(queryFind)
  //replace symbol with $
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, find => `$${find}`)
  //parse

  let find = JSON.parse(queryStr)
  
  if(params.select) {
    select = params.select.split(',').join(' ')
  }
  if(params.sort) {
    sort = params.sort.split(',').join(' ')
}
 
  if(categoryId !== 'all') {
    Object.assign(find,  {'category': categoryId})
  } else {
    find = {}
  }

  const foundProduct = await Product.find(find).populate({path: 'orders'}).select(select).sort(sort)
  if (!foundProduct) {
    throw new NotFoundError('Products in category id categoryId not found')
  }

  return foundProduct
}

const findAll = async (query: any): Promise<ProductDocument[]> => {
  const queryFind = {...query}
   let  select: any, sort: any
  const removeFields = ['select', 'sort','page','limit']
  removeFields.forEach(param => delete queryFind[param])
  
  // console.log(queryFind)
  //select fields 
  let queryStr = JSON.stringify(queryFind)
  //replace symbol with $
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, find => `$${find}`)
  //parse

   const find = JSON.parse(queryStr)

  if(query.select) {
    select = query.select.split(',').join(' ')
  }
  if(query.sort) {
    sort = query.sort.split(',').join(' ')
}
  const page = parseInt(query.page)
  const limit = parseInt(query.limit) 
  const skip = (page-1)*limit
  return Product.find(find).populate({path:'orders'}).select(select).sort(sort).skip(skip).limit(limit)
}

const update = async (
  productId: string,
  update: Partial<ProductDocument>
): Promise<ProductDocument | null> => {
  const foundProduct = await Product.findByIdAndUpdate(productId, update, {
    new: true,
  })

  if (!foundProduct) {
    throw new NotFoundError(`book ${productId} not found`)
  }

  return foundProduct
}

const deleteProduct = async (
  productId: string
): Promise<ProductDocument | null> => {
  const foundProduct = Product.findByIdAndDelete(productId)

  if (!foundProduct) {
    throw new NotFoundError(`Product ${productId} not found`)
  }

  return foundProduct
}
const event = async (params: any): Promise<ProductDocument | null | undefined>  => { 
  const type = params.type
  if(type != 'like' && type != 'dislike') {
      return
  } else {
      return Product.findByIdAndUpdate(params.id, {$inc: {[type]: 1}}, {new: true })
  }
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteProduct,
  findByCategoryId, 
  event
}
