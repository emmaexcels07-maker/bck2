import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
 
 { title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
    { timestamps: true }
);

const Todomod = mongoose.model("Todo", todoSchema);

export default Todomod;