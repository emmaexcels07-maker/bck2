import express from 'express';
import { authMiddleWare } from '../middlewares/auth.middleware.js';
import { createTodo, updateTodo, deleteTodo, getTodos } from '../controller/todo.controller.js';

const routerTodo = express.Router();

routerTodo.post('/create', authMiddleWare, createTodo);
routerTodo.put('/update/:id', authMiddleWare, updateTodo);
routerTodo.get('/get', authMiddleWare, getTodos);
routerTodo.delete('/delete/:id', authMiddleWare, deleteTodo);

export default routerTodo;