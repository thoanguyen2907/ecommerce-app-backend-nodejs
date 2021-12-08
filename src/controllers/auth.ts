import { Request, Response, NextFunction } from 'express'

import User from '../models/User'
import AuthService from '../services/auth'
import { BadRequestError } from '../helpers/apiError'
import jwt from 'jsonwebtoken'

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

// POST /movies
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastName, firstName, email, phone, password} = req.body

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
