import User, { UserDocument } from '../models/User'
import crypto from 'crypto'
import { sendEmail } from '../util/sendEmail'


const register = async (user: UserDocument): Promise<UserDocument> => {
  const newUser = await user.save()
  return newUser
}

const login = async (email: any, password: any, res: any) => {
  const result = await User.findByCredentials(email, password)
  if (result.err) {
    res.status(401).json({
      success: true,
      messages: result.err,
    })
  }
  return  result.user.getJwtToken()
}
export const forgotPassword =  async (item: any) => { 
  //find email of user in user model 
  const user = await User.findOne({email: item.email})   
  
  // user exist     
  if(user) {
   
      //send reset token to user and save in database
      const resetToken = await user.resetPassword()

      await user.save()
     
      console.log(user) 
      //create reset URL 
      const resetURL = `http://localhost:3000/resetPassword/${resetToken}`
      const message = `Access the link to change password : ${resetURL}`
      try {
          await sendEmail({
              email: item.email, 
              subject: 'Change Password',
              message
          })
          return 'Please check your email !!!'
      } catch(error) {
        console.log(error)
          user.resetPassToken = undefined,
          user.resetPassTokenExp = undefined,
          await user.save()
          return 'Cannot send Email, please try again'
      }
      
  } else {
      return false
  }      
}

export const resetPassword = async (item: any) => {
  const resetPassToken = crypto.createHash('sha256')
                          .update(item.resetToken)
                          .digest('hex')
  
  const user = await User.findOne( {resetPassToken: resetPassToken })
  if(!user) return false
  user.password = await item.password 
  user.resetPassToken = undefined
  user.resetPassTokenExp = undefined
  await user.save()
  return user
}


export default {
  register,
  login,
  forgotPassword, 
  resetPassword
}
