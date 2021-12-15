import { check } from 'express-validator'

interface ErrorProperty {
    value: string,
    msg: string,
    param: string,
    location: string
}



export default {
    checkUserID:  () => {
        return check('user')
        .notEmpty()
        .withMessage('UserID is not empty')
    },
    checkProductId:  () => {
        return check('products.product')
        .notEmpty()
        .withMessage('ProductID is not empty')
    },
    checkSizeOrder:  () => {
        return check('products.size')
        .notEmpty()
        .withMessage('Size is not empty')
    },
    checkColorOrder:  () => {
        return check('products.color')
        .notEmpty()
        .withMessage('Color is not empty')
    },
  
    showErrors : async (errors: any) => {
            const messages: any  = {}
        await errors.map((err: ErrorProperty) => {
            messages[err.param] = err.msg               
        })
    
       return messages
    }
}