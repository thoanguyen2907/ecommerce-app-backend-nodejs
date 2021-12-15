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

    checkSize:  () => {
        return check('size')
        .notEmpty()
        .isArray()
        .withMessage('Size is not empty and must be an array')
    },

    checkColor:  () => {
        return check('color')
        .notEmpty()
        .isArray()
        .withMessage('Color is not empty and must be an array')
    },
    checkDescription:  () => {
        return check('description')
        .notEmpty()
        .withMessage('Description is not empty')
    },
    checkPopular :  () => {
        return check('popular')
        .notEmpty()
        .isBoolean()
        .withMessage('Popular is not empty and must be a boolean')
    },
    checkNewArrival :  () => {
        return check('newArrival')
        .notEmpty()
        .isBoolean()
        .withMessage('New arrival is not empty and must be a boolean')
    },  
    checkProductImg :  () => {
        return check('productImg')
        .notEmpty()
        .withMessage('Product image is not empty')
    },
    checkVirtualImg :  () => {
        return check('virtualImg')
        .notEmpty()
        .withMessage('Virtual image is not empty')
    },
    checkBrand :  () => {
        return check('brand')
        .notEmpty()
        .withMessage('Brand is not empty')
    },

    showErrors : async (errors: any) => {
            const messages: any  = {}
        await errors.map((err: ErrorProperty) => {
            messages[err.param] = err.msg               
        })
    
       return messages
    }
}