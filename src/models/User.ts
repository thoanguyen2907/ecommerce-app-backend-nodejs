
/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document, Model } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { JWT_SECRET } from '../util/secrets'

export type UserDocument = Document & {
  lastName: string
  firstName: string
  email: string
  phone: string
  password: string
  role: string,
  resetPassToken: any,
  resetPassTokenExp: any,
  orders?: [],
  getJwtToken(): Promise<string>
resetPassword(): Promise<string>
}

const userSchema = new mongoose.Schema<UserDocument>({
  lastName: {
    type: String,
    index: true,
  },
  firstName: {
    type: String,
    index: true,
  },
  email: {
    type: String,
    index: true,
  },
  phone: {
    type: String,
    index: true,
  },
  password: {
    type: String,
    index: true,
  },
  role: {
    type: String,
    index: true,
  },
  resetPassToken: {
    type: String,
    index: true,
  },
  resetPassTokenExp: {
    type: Number,
    index: true,
  },
  order: {
    ref: 'orders',
    type: mongoose.Schema.Types.ObjectId
},
})
userSchema.pre<UserDocument>('save', function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = bcrypt.genSaltSync(10)
  this.password = bcrypt.hashSync(this.password, salt)
  next()
})

export interface UserModel extends Model<UserDocument> {
  findByCredentials(email: string, password: string): Promise<any>,

}

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: '10h',
  })
}
userSchema.methods.updateNew = async function (userNew) {

  const isMatch = await bcrypt.compare(userNew.password, this.password)
  if(!isMatch) {
    const salt = bcrypt.genSaltSync(10)
    userNew.password = await bcrypt.hashSync(userNew.password, salt)
    return userNew
  } 
  userNew.password = this.password
  return userNew
}

userSchema.methods.resetPassword  = function () {
  const resetToken    = crypto.randomBytes(20).toString('hex') 
  //create pass token for object user and update reset token in user
  this.resetPassToken = crypto.createHash('sha256')
                              .update(resetToken)
                              .digest('hex')
  // create reset pass token expire for user                       
  this.resetPassTokenExp = Date.now() + 10 * 60 * 1000   
  // return reset token 
  return resetToken

}


userSchema.statics.findByCredentials = async function (
  email: string,
  password: string
) {
  const err = ''

  //check empty
  if (!email || !password) return { err: 'Email và password ko đc rỗng' }
  //check email
  const user = await this.findOne({ email: email })
  
  if (!user) return { err: 'Email và password ko chính xác' }
  //check password
  const isMatch = bcrypt.compareSync(password, user.password)
  if (!isMatch) return { err: 'Password và Email ko chính xác' }
  return { user }
}

userSchema.virtual('orders', {
	ref: 'orders', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'user', // is equal to foreignField
 })

// Set Object and Json property to true. Default is set to false
userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

export default mongoose.model<UserDocument, UserModel>('users', userSchema)
