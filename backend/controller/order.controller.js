import Stripe from 'stripe';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import Order from '../models/order.js';


const stripe = new Stripe(process.env.STRIPE_SECRET);


export const createCheckoutSession = async (req, res) => {
try {
const userId = req.user;
const cart = await Cart.findOne({ userId });
if (!cart || cart.items.length === 0) return res.status(400).json({ success: false, message: 'Cart empty' });


const line_items = await Promise.all(cart.items.map(async i => {
const p = await Product.findById(i.productId);
return {
price_data: {
currency: 'usd',
product_data: { name: p.title, images: [ `${process.env.PUBLIC_URL || ''}${p.image}` ] },
unit_amount: Math.round(p.price * 100)
},
quantity: i.quantity
};
}));


const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
line_items,
mode: 'payment',
success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.CLIENT_URL}/cart`,
metadata: { userId }
});


const order = await Order.create({
userId,
items: await Promise.all(cart.items.map(async i => {
const p = await Product.findById(i.productId);
return { productId: p._id, name: p.title, price: p.price, quantity: i.quantity, image: p.image };
})),
total: cart.items.reduce((s, i) => s + (i.quantity * (await Product.findById(i.productId)).price), 0),
paymentIntentId: session.id,
status: 'pending'
});


res.json({ success: true, url: session.url });
} catch (err) {
console.error(err);
res.status(500).json({ success: false, message: err.message });
}
};


export const handleSuccess = async (req, res) => {
// optional: verify session and mark order paid
res.json({ success: true });
};