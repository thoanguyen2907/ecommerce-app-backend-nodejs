import { Request, Response, NextFunction } from 'express'

import User from '../models/User'
import UserService from '../services/user'
import { BadRequestError } from '../helpers/apiError'
import  {validationResult } from 'express-validator'
import validation from '../validates/products'
// POST /movies
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await validationResult(req)

    if (!result.isEmpty()) {
      const errors = await result.array()
     
      const messages = await validation.showErrors(errors)    
      res.status(400).json({
          success : false,
          data : messages
      })
      return        
    } else {
      const { lastName, firstName, email, phone, password } = req.body
      const user = new User({
        lastName,
        firstName,
        email,
        phone,
        password,
        role: 'user'
      })
    const newUser = await UserService.create(user)
    const token = await newUser.getJwtToken()
   return res.status(200).json({ 
     success: true,
     newUser,
     token
    }) }
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /movies/:movieId
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
    const updatedUser = await UserService.update(userId, update)
    return res.status(200).json({
      success: true,
      updatedUser
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
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.params.userId)
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
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = await UserService.findById(req.params.userId)
    const data = {
      _id: userData._id,
      id: userData.id,
      lastName: userData.lastName,
      firstName: userData.firstName,
      email: userData.email,
      role: userData.role,
      orders: userData.orders
    } 
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
    const data = await UserService.findAll()
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
