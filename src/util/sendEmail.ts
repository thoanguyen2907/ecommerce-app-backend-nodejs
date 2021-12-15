import nodemailer from 'nodemailer'
import { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, FORM_NAME,
    FORM_EMAIL} from '../config/system'


// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (options: any) =>  {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: SMTP_EMAIL, // generated ethereal user
      pass: SMTP_PASSWORD, // generated ethereal password
    },
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `${FORM_NAME} <${FORM_EMAIL}>` , // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  })
  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


