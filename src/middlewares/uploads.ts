import multer  from 'multer'
export const uploadImage = (type: any) => {

    const storage = multer.diskStorage({
        destination:  (req, file, cb) => {
          cb(null, './uploads')
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now()
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
            cb(null, true)
          } else {
            throw new Error('File extension is not accepted')
          }
        }
      })
    return upload.single(type)
}