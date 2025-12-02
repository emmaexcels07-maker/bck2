import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
title: String,
price: Number,
image: String,
description: String,
createdAt: { type: Date, default: Date.now }
});


export default mongoose.models.Product || mongoose.model('Product', productSchema);