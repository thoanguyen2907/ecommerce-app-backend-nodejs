import { info } from 'console'
import nodemailer from 'nodemailer'
import { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, FORM_NAME,
    FORM_EMAIL} from '../config/system'


// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (options: any) =>  {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: 'thoang2907123@gmail.com', // generated ethereal user
      pass: '29071995@', // generated ethereal password
    },
  })

  // send mail with defined transport object
   await transporter.sendMail({
    from: `${FORM_NAME} <${FORM_EMAIL}>` , // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  }, (error, info) => {
    if(error) {
     return console.log(error.message)
    } 
    console.log('success')
  })

}


