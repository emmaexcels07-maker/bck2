const productSchema = new mongoose.Schema({
  title: { type: String, index: true },
  price: Number,
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now, index: true }
});
