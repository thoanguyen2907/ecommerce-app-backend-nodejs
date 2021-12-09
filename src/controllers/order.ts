
import { Request, Response, NextFunction } from 'express'
import Order from '../models/Order'
import OrderService from '../services/order'
import { BadRequestError } from '../helpers/apiError'

// POST /movies
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, products} = await req.body
    const quantity = 1

    const order = new Order({user, products})
     const userOrderList = await OrderService.getOrderByUserId(user)
    // console.log(userOrderList)
   const productList =  userOrderList.map((item) => {
     return item.products
   })
   productList.map(async (item) => {
     console.log(item)
    //  const isExistProduct = await OrderService.findById(item.product.id)
   })
   console.log(productList)
  // const indexProductOrder = await productList.findIndex((item) => item.product.id === products.product)
  //  console.log(indexProductOrder)

    // await OrderService.create(order)
    // res.status(200).json({
    //   status: 200, 
    //   data: order
    // })
   
   

  } catch (error) {
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
    res.json(updatedCategory)
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
    console.log(req.params.orderId)
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

// GET /movies/:movieId
export const findOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await OrderService.findById(req.params.orderId))
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
     res.json(await OrderService.getOrderByUserId(req.params.userId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}




