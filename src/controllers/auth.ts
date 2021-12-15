import { Request, Response, NextFunction } from 'express'
import UserService from '../services/user'
import User from '../models/User'
import AuthService from '../services/auth'
import { BadRequestError } from '../helpers/apiError'
import jwt from 'jsonwebtoken'
import  {validationResult } from 'express-validator'
import validation from '../validates/products'
import crypto from 'crypto'
import { sendEmail } from '../util/sendEmail'

interface JwtPayload {
  id: string
}

const saveCookieResponse = (res: any, statusCode: any, token: any) => {
  const options = {
    expirers: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpsOnly: true,
  }
   res.cookie('token', token, options)
}
export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastName, firstName, email, phone, password} = req.body
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
      const user = new User({
        lastName,
        firstName,
        email,
        phone,
        password,
        role: 'admin'
      })
  
      const newUser = await AuthService.register(user)
      console.log(newUser)
      const token = await newUser.getJwtToken()
      if (token) {
        saveCookieResponse(res, 201, token)
      }
      res.status(201).send({
        newUser,
        token
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


// POST /movies
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastName, firstName, email, phone, password} = req.body
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
      const user = new User({
        lastName,
        firstName,
        email,
        phone,
        password,
        role: 'user'
      })
      const newUser = await AuthService.register(user)
      console.log(newUser)
      const token = await newUser.getJwtToken()
      if (token) {
        saveCookieResponse(res, 201, token)
      }
      res.status(201).send({
        newUser,
        token
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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = await req.body
    const token = await AuthService.login(email, password, res)
    const {id} =  jwt.verify(token, 'abc') as JwtPayload
    const userFound = await User.findById(id)
    console.log(userFound)
    if(token) {
      saveCookieResponse(res, 201, token)
    }
      res.status(201).send({
        success: true,
        token,
        userFound
      })
  
  
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
export const aboutMe = (
  req: Request,
  res: Response
) => {
  res.status(200).json({
    success: true, 
    user: req.user
  })
}
export const logout= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).cookie('token','none',{
      expires: new Date(
        Date.now() + 10 * 1000
      )
    }).json({
      success: true,
    })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
export const forgotPasswordUser =  async ( 
  req: Request,
  res: Response,
  next: NextFunction
  ) => { 
    const result = await AuthService.forgotPassword(req.body)
    if(!result) {
        res.status(401).json({
            success: true,
            messages: 'Email is not exists'
        })
    } else {
        res.status(201).json({
            success: true,
            data: result
        })
    }
      
}

export const resetPasswordUser = async ( 
  req: Request,
  res: Response,
  next: NextFunction
  ) => {
  const result = await AuthService.resetPassword({resetToken: req.params.resetToken, 
    password: req.body.password
    })
    if(!result) {
        res.status(401).json({
            success: true,
            messages: 'The reset token is not available'
        })
    } else {
        res.status(201).json({
            success: true, 
            result
        })
    }
}

