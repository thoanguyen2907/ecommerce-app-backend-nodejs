import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
interface JwtPayload {
        id: string
}
interface PayloadType {
        _id: number,
        lastName: string
        firstName: string
        email: string
        phone: string
        password: string
        role: string
}
export const project =  async  (req: Request,res: Response,next: NextFunction) => {
        let token = ''
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1]
        } else if(req.cookies.token){
                token = req.cookies.token
        }
        if(!token) {
                return res.json({
                        status: 401,
                        messages: 'Please log in'
                })
        }
        //decode token
        try {
         const {id} = jwt.verify(token, 'abc') as JwtPayload
         const userFound = await User.findById(id)
         if(userFound) {
                const userReq = userFound as PayloadType
                req.user  = userReq
              
         }       
        } catch(error) {
         return next(res.json({
                        status: 401,
                        messages: 'Please log in'
                }))   
        }
        next()
}

export const authorize = (...roles: any) => {
        return (req: Request,res: Response,next: NextFunction) => {
                if(!roles.includes((req.user as PayloadType).role)) {
                        return res.status(403).json({
                            messages: 'You do not have authority !!!!'
                        }) 
                    }
                    next()
                 
    }   
}