import { check } from 'express-validator'

interface ErrorProperty {
    value: string,
    msg: string,
    param: string,
    location: string
}

const options = {
    lastName: {min: 2, max: 10},
    firstName: {min: 2, max: 10},
    phone: {min: 5, max: 12}, 
    password: {min: 5, max: 20},
    enum: ['user', 'admin']
}

export default{
    checkLastName: () => {
        return check('lastName')
        .notEmpty()
        .isLength({ min: options.lastName.min, max: options.lastName.max })
        .withMessage(`Last name is not empty and length must be greater than ${options.lastName.min} and less than ${options.phone.max}`)
    },
    checkEmail: () => {
        return check('email')
        .notEmpty()
        .isEmail()
        .withMessage('Email must be in right format')      
    },
    checkFirstName: () => {
        return check('firstName')
        .notEmpty()
        .isLength({ min: options.firstName.min, max: options.firstName.max })
        .withMessage(`First name is not empty and length must be greater than ${options.firstName.min} and less than ${options.phone.max}`)
    },
    checkPhone: () => {
        return check('phone')
        .notEmpty()
        .isLength({ min: options.phone.min, max: options.phone.max })
        .withMessage(`Phone is not empty and length must be greater than ${options.phone.min} and less than ${options.phone.max}`)
    },
    checkPassword: () => {
        return check('password')
        .notEmpty()
        .isLength({ min: options.password.min, max: options.password.max })
        .withMessage(`Password is not empty and length must be greater than ${options.password.min} and less than ${options.password.max}`)
    },
    showErrors : async (errors: any) => {
            const messages: any  = {}
        await errors.map((err: ErrorProperty) => {
            messages[err.param] = err.msg               
        })
    
       return messages
    }
}