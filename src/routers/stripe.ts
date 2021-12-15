import express from 'express'
import  Stripe from 'stripe'
import { Request, Response, NextFunction } from 'express'
const router = express.Router()

const stripe = new Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc',
{
    apiVersion: '2020-08-27',
    typescript: true
  }
)

router.post('/create-checkout-session', async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
        console.log(req.body)
       const purchasedItems = await req.body?.map((item: any) => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item?.name
                    },
                    unit_amount_decimal: `${item?.price * item?.quantity * 100}`,
               
                },
                quantity: item?.quantity
            }
        })
        console.log(purchasedItems)
        const session = await stripe.checkout.sessions.create({
    
            mode: 'payment',
            line_items: purchasedItems,
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel'
          })
        
          res.json({url: session.url})
})

export default router