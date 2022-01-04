import User, { UserDocument } from '../models/User'
import { NotFoundError } from '../helpers/apiError'

const create = async (user: UserDocument): Promise<UserDocument> => {
  return user.save()
}

const findById = async (userId: string): Promise<UserDocument> => {
  const foundUser = await User.findById(userId).populate({path: 'orders'})

  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }

  return foundUser
}

const findAll = async (): Promise<UserDocument[]> => {
  return User.find().populate({path: 'orders'}).sort({ name: 1 })
}
const findUserToken = async (resetPassToken: any): Promise<UserDocument | null> => {
  return User.findOne({
    resetPassToken: resetPassToken,
     resetPassTokenExp : {$gt: Date.now()}
  })
}
const findUserEmail = async (email: any): Promise<UserDocument | null> => {
  return User.findOne({
    email: email
  })
}


const update = async (
  userId: string,
  update: Partial<UserDocument>
): Promise<UserDocument | null> => {
  const foundUser = await User.findByIdAndUpdate(userId, update, {
    new: true,
  })

  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }

  return foundUser
}

const deleteUser = async (userId: string): Promise<UserDocument | null> => {
  const foundUser = User.findByIdAndDelete(userId)

  if (!foundUser) {
    throw new NotFoundError(`Movie ${userId} not found`)
  }

  return foundUser
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteUser,
  findUserToken,
  findUserEmail
}
