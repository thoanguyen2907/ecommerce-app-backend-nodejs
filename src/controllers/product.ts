import { Request, Response, NextFunction } from 'express'

import Product from '../models/Product'
import ProductService from '../services/product'
import { BadRequestError } from '../helpers/apiError'
import { check, validationResult } from 'express-validator'
import  validation from '../validates/Products'

// POST /movies
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, category, price, description, brand, size, color, productImg,
      popular, newArrival, virtualImg } = req.body
      const result = await validationResult(req)
      if (!result.isEmpty()) {
        const errors = result.array()
        const messages = await validation.showErrors(errors)    
       
        res.status(400).json({
            success : false,
            data : messages
        })
        return       
      } else {
        const product = new Product({
          name,
          category,
          price,
          description, 
          brand, 
          size,
          color,
          productImg,
          newArrival,
          popular,
          virtualImg
        })
        await ProductService.create(product)
        res.status(200).json({
          status: 200, 
          data: product
        })
      }
    
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /movies/:movieId
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const productId = req.params.productId
    const updatedMovie = await ProductService.update(productId, update)
    res.json(updatedMovie)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /movies/:movieId
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.params.productId)
    await ProductService.deleteProduct(req.params.productId)
    res.status(204).json({
      status: 204,
      messages: 'Delete successfully !!!'
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

export const voteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.event({'id' :req.params.productId,'type' :  req.params.type}))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /movies/:movieId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findById(req.params.productId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
export const findByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findByCategoryId({'categoryId': req.params.categoryId, 'query': req.query}))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /movies
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productArray = await ProductService.findAll(req.query)
    res.status(200).json({
      success: true,
      count: productArray.length,
      data: productArray
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
