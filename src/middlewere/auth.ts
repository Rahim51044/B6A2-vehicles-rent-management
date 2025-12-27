
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

// decoded user interface
interface DecodedUser extends JwtPayload {
  id: number;
  role: string;
  email: string;
}

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      console.log(authHeader)

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Authorization header missing!",
        });
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Invalid token!",
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as DecodedUser;

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default auth;
