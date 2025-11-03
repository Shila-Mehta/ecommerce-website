import {Router} from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
const router=Router();

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // put in .env file!

// Create Payment Intent (for card payments)
router.post("/", async (req, res) => {
  try {
    const { amount } = req.body; // amount in cents (e.g., $10 = 1000)

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },

    });



    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


export default router;