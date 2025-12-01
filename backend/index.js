import express from 'express';
import { ConnectMongodb } from './database/mongodb.js';
import { PORT } from './config/env.js';
import { Router } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import routerTodo from './routes/todo.route.js';
import Authrouter from './routes/auth.routes.js';
import dotenv from 'dotenv';
import { createTodo, updateTodo, deleteTodo, getTodos } from './controller/todo.controller.js';

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: FRONTEND_URL,
  Credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use('/api/v1/auth', Authrouter);
app.use('/api/v1/todo', routerTodo);


(async function startServer() {
  try {
    await ConnectMongodb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`CORS origin: ${FRONTEND_URL}`);
      // Avoid logging secrets in production
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
dotenv.config();



