import { registerUser, loginUser, aboutMe, logout, forgotPasswordUser, resetPasswordUser } from './../controllers/auth'
import express, { response } from 'express'
import {protect} from '../middlewares/auth'
import  validation from '../validates/Users'
import { Request, Response, NextFunction } from 'express'
import {OAuth2Client} from 'google-auth-library'
import { createLogger } from 'winston'
import User from '../models/User'
import jwt from 'jsonwebtoken'

const router = express.Router()

const client = new OAuth2Client('627197289438-q9pagstkv3sk03pbssfisjqgrgidv7lo.apps.googleusercontent.com')
// Every path we define here will get /api/v1/movies prefix
router.post('/register',validation.checkEmail(),
validation.checkFirstName(),
validation.checkLastName(),
validation.checkPassword(),
validation.checkPhone(),
registerUser)

router.post('/login', loginUser)
router.get('/me', protect, aboutMe)
router.get('/logout', protect, logout)
router.post('/forgotPassword', protect, forgotPasswordUser)
router.post('/resetPassword/:resetToken', protect, resetPasswordUser)
router.post('/google-login', async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
        const {tokenId} = await req.body
        client.verifyIdToken({idToken: tokenId, audience: '627197289438-q9pagstkv3sk03pbssfisjqgrgidv7lo.apps.googleusercontent.com'}).then(async (response) => {
            if (response.getPayload() && response.getPayload()?.email_verified) {
                const email = await response.getPayload()?.email
                const name = await response.getPayload()?.name
                console.log(email)
                console.log(name)

               const user =  await User.findOne({email: email})
                console.log(user)
                if(user) { 
                 req.user  = user
            const token = await jwt.sign({ _id: user._id }, 'abc', {
            expiresIn: '2h',
          })
          const { _id, email, lastName, firstName, role } = user
          return res.status(200).json({
            token, 
            user:  { _id, email, lastName, firstName, role }
          })
                } 
                else {
                 const password = email+'ahcdada'
                 const newUser = new User(({lastName: name, email, password}))
                 newUser.save((err, data) => {
                     console.log(data)
                    const token = jwt.sign({_id: data._id}, 'abc', {
                        expiresIn: '2h'})
                    const {_id, lastName, email} = newUser
                    res.json({
                        token,
                        user: {_id, lastName, email}
                    })
                 })
                
                }
            }
        })
})


export default router
