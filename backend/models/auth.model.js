import mongoose from "mongoose";

const authSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [5, 'Email must be at least 5 characters long'],
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }

},

    { timestamps: true }

);

// models/user.model.js
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, select: false },
  role: { 
    type: String, 
    enum: ["customer", "seller", "admin"], 
    default: "customer" 
  },
  isSellerApproved: { type: Boolean, default: false } // Only set to true if Admin approves
});

export default mongoose.model("auth", authSchema);

const Auth = mongoose.model("auth", authSchema);
