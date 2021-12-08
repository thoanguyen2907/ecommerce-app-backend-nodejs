import fs from 'fs'
import mongoose from 'mongoose'

import BookSchemas from './src/models/Product'
import UserSchemas from './src/models/User'

const globalAny: any = global

globalAny.__base = __dirname + '/'
 
mongoose.connect(
  'mongodb+srv://thanhthoa:thoa123@nodejstraining.4cyhs.mongodb.net/library?retryWrites=true&w=majority'
)

const Books = JSON.parse(
  fs.readFileSync(`${__dirname}/src/data/book.json`, 'utf-8')
)
const Users = JSON.parse(
  fs.readFileSync(`${__dirname}/src/data/user.json`, 'utf-8')
)

const importData = async () => {
  try {
    await BookSchemas.create(Books)
    await UserSchemas.create(Users)
    console.log('importData...')
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

const deleteData = async () => {
  try {
    await BookSchemas.deleteMany({})
    await UserSchemas.deleteMany({})
    console.log('deleteData...')
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

if (process.argv[2] === '-i') {
  importData()
  console.log(process.argv[2])
} else if (process.argv[2] === '-d') {
  deleteData()
  console.log(process.argv[2])
}
