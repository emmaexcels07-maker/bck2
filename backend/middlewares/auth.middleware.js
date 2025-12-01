import jwt from "jsonwebtoken";
import { JWT_SECRETE } from "../config/env.js";

export const authMiddleWare = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) 
        return res.status(401).json({ message: "Authorization header missing" });
        const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRETE);
        req.user = decoded;
        console.log(decoded);
        next(); 
    } catch (error) {
        return res.status(500).json( error.message );  
        console.error("Authentication error:", error);

    }   
}


