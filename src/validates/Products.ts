import { check } from 'express-validator'

interface ErrorProperty {
    value: string,
    msg: string,
    param: string,
    location: string
}

const options = {
    name: {min: 2}, 
    category: {min: 2},
    price: {min: 80}
}

export default{
    checkName:  () => {
        return check('name')
        .isLength({ min: options.name.min })
        .withMessage(`Name is not empty and length must be greater than ${options.name.min} letters`)
    },
   
    checkPrice:  () => {
        return check('price')
        .isNumeric()
        .isFloat({ min: 80, max: 1500})
        .withMessage(`Price is not empty and must be a number. Price should be from ${options.price.min}`)
    },
    showErrors : async (errors: any) => {
            const messages: any  = {}
        await errors.map((err: ErrorProperty) => {
            messages[err.param] = err.msg               
        })
    
       return messages
    }
}