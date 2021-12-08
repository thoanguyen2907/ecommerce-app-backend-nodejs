import { check } from 'express-validator'

interface ErrorProperty {
    value: string,
    msg: string,
    param: string,
    location: string
}

const options = {
    name: {min: 2}, 
    title: {min: 2},
    slug: {min: 2}
}

export default{
    checkName:  () => {
        return check('name')
        .isLength({ min: options.name.min })
        .withMessage(`Name is not empty and length must be greater than ${options.name.min} letters`)
    },
    checkTitle:  () => {
        return check('title')
        .isLength({ min: options.title.min })
        .withMessage(`Title is not empty and length must be greater than ${options.title.min} letters`)
    },
    checkSlug:  () => {
        return check('slug')
        .isLength({ min: options.slug.min })
        .withMessage(`Slug is not empty and length must be greater than ${options.slug.min} letters`)
    },
    showErrors : async (errors: any) => {
            const messages: any  = {}
        await errors.map((err: ErrorProperty) => {
            messages[err.param] = err.msg               
        })
    
       return messages
    }
}