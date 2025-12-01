import Todomod from "../models/todo.model.js";


export const createTodo = async (req, res) => {
    try {
        const todo = await Todomod.create({
            title: req.body.title,
            description: req.body.description,
            owner: req.user.id
        });
        return res.status(201).json({ message: "Todo created successfully", 
            todo });
    } catch (error) {
        return res.status(500).json({ message: error.message }); 
    }
}

export const getTodos = async (req, res) => {
    try {
        const todos = await Todomod.find({ owner: req.user.id });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

    export const updateTodo = async (req, res) => {
    try {
        const todo = await Todomod.findOneAndUpdate({_id: req.params.id, owner: req.user.id}, req.body, { new: true });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json({ message: "Todo updated successfully", todo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
 }

export const deleteTodo = async (req, res) => {
    try {
        const todo = await Todomod.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
}