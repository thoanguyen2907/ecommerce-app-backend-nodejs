
import { Request, Response, NextFunction } from 'express'
import Order from '../models/Order'
import OrderService from '../services/order'
import { BadRequestError } from '../helpers/apiError'
import { check, validationResult } from 'express-validator'
import  validation from '../validates/Order'

// POST /movies
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, products} = await req.body
    const result = await validationResult(req)
    if (!result.isEmpty()) {
      const errors = result.array()
      const messages = await validation.showErrors(errors)    
     
      return  res.status(400).json({
          success : false,
          data : messages
      })
    
    } else {
      const order = new Order({user, products})
      const userOrderList = await OrderService.getOrderByUserId(user)
    const productOrder = await userOrderList.find((item) => item.products.product._id == products.product)
    if(!productOrder) {
       await OrderService.create(order)
       return res.status(200).json({
         status: 200, 
         data: order
       })
     } else { 
     const orderUpdateQuantity = await OrderService.updateQuantityProductOrder(productOrder._id)
     return res.status(200).json({
       status: 200, 
       data: orderUpdateQuantity
     })
      }
    }
   }
   catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
export const increaseQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   const data = await OrderService.increaseQuant(req.params.orderId)
          res.status(200).json({
            success : true,
            data : data
        })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
export const decreaseQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   const data = await OrderService.decreaseQuant(req.params.orderId)
          res.status(200).json({
            success : true,
            data : data
        })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /movies/:movieId
export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const orderId = req.params.orderId
    const updatedCategory = await OrderService.update(orderId, update)
    res.status(200).json( {
      success: true,
      updatedCategory
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /movies/:movieId
export const deleteOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await OrderService.deleteOrder(req.params.orderId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /orders/:orderId
export const findOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await OrderService.findById(req.params.orderId);
    res.status(200).json({
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

// GET /movies
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderArray = await OrderService.findAll(req.query)
    res.status(200).json({
      success: true,
      count: orderArray.length,
      data: orderArray
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
export const findOrderByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await OrderService.getOrderByUserId(req.params.userId)
     res.status(200).json({
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




