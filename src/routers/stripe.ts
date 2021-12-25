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
// router.post('/payment', async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//     ) => {
//         console.log(req.body)
//       stripe.charges.create({
//             source: req.body.tokenId,
//             amount: req.body.amount,
//             currency: 'eur' 
//         } )
// })

  
router.post('/create-checkout-session', async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    
        const {order}  = req.body
        console.log(order)
       const purchasedItems = await req.body?.order?.map((item: any) => {
            return {
                price_data: {
                    currency: 'usd',
                    unit_amount: item?.price,
                    product_data: {
                        name: item?.name,
                        description: item?.description
                    },
                  
               
                },
                quantity: item?.quantity
            }
        })
        console.log(purchasedItems)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: purchasedItems,
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel'
          })
        
          res.json({url: session.url})
})

export default router