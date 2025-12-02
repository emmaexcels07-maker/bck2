import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user });
  if (!cart) cart = await Cart.create({ userId: req.user, items: [] });
  // populate product details
  const detailed = await Promise.all(cart.items.map(async i => {
    const p = await Product.findById(i.productId);
    return { productId: i.productId, quantity: i.quantity, name: p.title, price: p.price, image: p.image };
  }));
  res.json({ success: true, cart: detailed });
};

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ userId: req.user });
  if (!cart) cart = await Cart.create({ userId: req.user, items: [] });

  const idx = cart.items.findIndex(i => i.productId === productId);
  if (idx >= 0) cart.items[idx].quantity += quantity;
  else cart.items.push({ productId, quantity });

  await cart.save();
  res.json({ success: true, cart });
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  let cart = await Cart.findOne({ userId: req.user });
  if (!cart) return res.json({ success: true, cart: [] });

  cart.items = cart.items.filter(i => i.productId !== productId);
  await cart.save();
  res.json({ success: true, cart });
};

export const clearCart = async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user });
  if (!cart) cart = await Cart.create({ userId: req.user, items: [] });
  cart.items = [];
  await cart.save();
  res.json({ success: true });
};
