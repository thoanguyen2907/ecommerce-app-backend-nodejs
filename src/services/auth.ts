import User, { UserDocument } from '../models/User'

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


export default {
  register,
  login,

}
