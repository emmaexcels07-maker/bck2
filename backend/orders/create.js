for (const item of cartItems) {
  const product = await Product.findById(item._id);

  if (!product || product.stock < item.quantity) {
    return res.status(400).json({
      message: `${product.name} is out of stock`
    });
  }
}
