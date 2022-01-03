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
import {OAuth2Client} from 'google-auth-library'
import { JWT_SECRET, OAuth2ClientId } from '../util/secrets'

interface JwtPayload {
  id: string
}
const client = new OAuth2Client(OAuth2ClientId)

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
      const token = await newUser.getJwtToken()
      if (token) {
        saveCookieResponse(res, 201, token)
      }
      res.status(201).json({
        success: true,
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
      res.status(201).json({
        success: true,
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
    const {id} =  jwt.verify(token, JWT_SECRET) as JwtPayload
    const userFound = await User.findById(id)

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
export const loginGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction) => {
    const {tokenId} = await req.body
    client.verifyIdToken({idToken: tokenId, audience: '627197289438-q9pagstkv3sk03pbssfisjqgrgidv7lo.apps.googleusercontent.com'}).then(async (response) => {
     
        if (response.getPayload() && response.getPayload()?.email_verified) {
            const email =  response.getPayload()?.email
            const name =  response.getPayload()?.name
           const user =  await User.findOne({email: email})
          // console.log('user', user)
            if(user) { 
             req.user  = user
             const token = await jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '2h',
      })
      const { _id, email, lastName , id} = user
      return res.status(201).json({
        success: true,
        token,       
        user:  { _id, email, lastName, firstName: 'Google', role: 'user', id }
      })
            } 
            else {
             const password = email+ 'ahcdada'
             
             const userGoogleLogin = await new User({firstName: 'Google login',lastName: name, email, password, role: 'user'})
           
             const newUser = await AuthService.register(userGoogleLogin)
              // console.log('newUser', newUser)
             newUser.save((err, data) => {
               
                const token = jwt.sign({ id: data._id }, JWT_SECRET, {
                      expiresIn: '2h',
                    })
                const {_id, lastName, email, id} = newUser
                res.status(201).json({
                  success: true,
                  messages: 'User via Google Login created',
                  token,
                  user: {_id, id, lastName, firstName: 'Google login', email, role: 'user'}
                })
             })
            
            }
        } else {
          res.status(401).json({
            messages: 'Login failed'
          })
        }
    })
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
            success: false,
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
            success: false,
            messages: 'The reset token is not available'
        })
    } else {
        res.status(201).json({
            success: true, 
            result
        })
    }
}

