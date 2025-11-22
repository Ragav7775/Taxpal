import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to hold userID
declare global {
    namespace Express {
        interface Request {
            userID?: string;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET!


export const GenerateJWTToken = (userID: string): string => {
    return jwt.sign({ id: userID }, JWT_SECRET, { expiresIn: "3d" });
};


export const AuthenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.auth_token;

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        req.userID = decoded.id;
        return next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};