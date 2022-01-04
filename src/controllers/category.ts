import { Request, Response, NextFunction } from 'express'

import Category from '../models/Category'
import CategoryService from '../services/category'
import ProductService from '../services/product'
import { BadRequestError } from '../helpers/apiError'
import  {validationResult } from 'express-validator'
import validation from '../validates/Category'
import { resolveSoa } from 'dns'
// POST /category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validationResult(req)
    
    if (!result.isEmpty()) {
      const errors = await result.array()
      const messages = await validation.showErrors(errors)    
      res.status(400).json({
          success : false,
          data : messages
      })
      return        
    }
    const { name, title, slug } = req.body
    const category = new Category({
      name,
      title,
      slug
    })

    await CategoryService.create(category)
    res.status(200).json({
      success : true,
      category
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /category/:categoryId
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const categoryId = req.params.categoryId
    const updatedCategory = await CategoryService.update(categoryId, update)
    res.status(201).json({
      success: true,
      data: updatedCategory
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /category/:categoryId
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CategoryService.deleteCategory(req.params.categoryId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /category/:categoryId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await ProductService.findById(req.params.categoryId)
    res.status(201).json({
      success: true,
      data
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /category
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryArray = await CategoryService.findAll(req.query)
    res.status(200).json({
      success: true,
      count: categoryArray.length,
      data: categoryArray
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
