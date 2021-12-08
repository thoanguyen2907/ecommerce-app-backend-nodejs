import Category, { CategoryDocument } from '../models/Category'

import { NotFoundError } from '../helpers/apiError'


const create = async (category: CategoryDocument): Promise<CategoryDocument> => {
  return category.save()
}

const findById = async (categoryId: string): Promise<CategoryDocument> => {
  const foundCategory = await Category.findById(categoryId)

  if (!foundCategory) {
    throw new NotFoundError(`Category ${categoryId} not found`)
  }

  return foundCategory
}

const findAll = async (query: any): Promise<CategoryDocument[]> => {

  const queryFind = {...query}
   let find: any, select: any, sort: any
  const removeFields = ['select', 'sort','page','limit']
  removeFields.forEach(param => delete queryFind[param])
  //select fields 
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
  return Category.find(find).populate({path: 'products'}).select(select).sort(sort)
}

const update = async (
  categoryId: string,
  update: Partial<CategoryDocument>
): Promise<CategoryDocument | null> => {
  const foundCategory= await Category.findByIdAndUpdate(categoryId, update, {
    new: true,
  })

  if (!foundCategory) {
    throw new NotFoundError(`book ${categoryId} not found`)
  }

  return foundCategory
}

const deleteCategory = async (
  categoryId: string
): Promise<CategoryDocument | null> => {
  const foundCategory = Category.findByIdAndDelete(categoryId)

  if (!foundCategory) {
    throw new NotFoundError(`Category ${categoryId} not found`)
  }

  return foundCategory
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteCategory,
}
