const express = require("express")
const Order = require("../Models/Order")
const User = require("../Models/User")
require('dotenv').config()
const router2 = express.Router()
const stripe = require('stripe')(process.env.STRIPE_KEY)
const NewPrice = require('../newPrice')
const {sendMail} = require('../Routes/email')
const getRawBody = require('raw-body')


router2.post('/create-checkout-session', async (req, res) => {
    //para solucionar mañana si no lo resuelvo hoy convertir el precio de string a Number antes de pasarselo a la propiedad cart
    //esto porque el precio es Number y recibe un string como precio
    //console.log(req.body.NcartItems)
    const customer = await stripe.customers.create({
        metadata: {
            userId: req.body.userId,
            cart: JSON.stringify(req.body.NcartItems)
        }
    })
    const line_items = await req.body.NcartItems.map(item => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.image],
                    metadata: {
                        id: item.id
                    },
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }
    })
    //el precio es el del problema arreglar
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: { allowed_countries: ['US', 'CA', 'MX'] },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 0, currency: 'usd' },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 5 },
                        maximum: { unit: 'business_day', value: 7 },
                    },
                },
            },
        ],
        phone_number_collection: {
            enabled: true
        },
        customer: customer.id,
        line_items: line_items,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}`,
    });

    res.send({ url: session.url });
});

//create order
const createOrder = async (customer, data) => {
    const Items = JSON.parse(customer.metadata.cart);
    
    const newOrder = new Order({
        userId: customer.metadata.userId,
        customerId: data.customer,
        paymentIntentId: data.payment_intent,
        products: Items,
        subtotal: data.amount_subtotal,
        total: data.amount_total,
        shipping: data.customer_details,
        payment_status: data.payment_status
    })
    try {
        const savedOrder = await newOrder.save()
        /*const user = await User.findById(savedOrder.userId)

        if(user){
            sendMail(user.email, Items)
        }*/
        console.log("Processed Order:", savedOrder)
    }
    catch (err) {
        console.log(err)
    }
}
//stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.

//verify that webhook comes from strype added by me
router2.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let data;
    let eventType;
    let event;
    
    if (process.env.ENDPOINT_SECRET) {
        
        try {
            //cambie el req.body a req.rawBody porque lo añadi en el index
            //console.log("rawBody", req.rawBody)
            //console.log("sig", sig)
            event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.ENDPOINT_SECRET);
            //console.log("event", event.type)
            console.log('webhook verified')
        } catch (err) {
            console.log(`Webhook Error: ${err.message}`)
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        data = event.data.object
        eventType = event.type
    } else {
        data = req.body.data.object
        eventType = req.body.type
    }
    //handle the event
    if (eventType === "checkout.session.completed") {
        console.log("eventType", req.body.type)
        //la info del cliente vendra de la info almacenada en data que contiene toda la información del cliente
        //es decir la que el cliente coloco en los campos del formulario y yo manejo en la sessión
        stripe.customers.retrieve(data.customer).then((customer) => {
            createOrder(customer, data)
        }).catch(err => console.log(err))
    }
    // Return a 200 response to acknowledge receipt of the event
    res.send().end();
});

module.exports = router2