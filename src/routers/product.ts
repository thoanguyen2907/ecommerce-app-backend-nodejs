import express from 'express'
import {
  createProduct,
  findById,
  deleteProduct,
  findAll,
  updateProduct,
  voteProduct
} from '../controllers/product'
import  multer from 'multer'
import {uploadImage} from '../middlewares/uploads'
const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname )
  }
})

const upload = multer({ 
  storage: storage,
  fileFilter : function (req,file, cb) {
    const extensionImageList = ['.png', '.jpg']
    const extension = file.originalname.slice(-4)
    const check = extensionImageList.includes(extension)
    if(check) {
     return cb(null, true)
    } else {
      return new Error('File extension is not accepted')
    }
  }
})

const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
router.get('/', findAll)
router.get('/:productId', findById)
router.put('/:productId', updateProduct)
router.delete('/:productId',deleteProduct)
router.post('/', createProduct)
router.put('/event/:type/:productId', voteProduct)

router.post('/upload-avatar', async (req) => {
 
  console.log(req.body)
 
})
export default router
