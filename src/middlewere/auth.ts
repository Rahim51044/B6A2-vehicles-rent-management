
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "You are not allowed!" });
      }

//       interface DecodedUser extends JwtPayload {
//   id: number;
//   role: string;
//   email: string;
// }

//       const token = authHeader.startsWith("Bearer ")
//         ? authHeader.slice(7)
//         : authHeader;
//       if (!token) {
//         return res.status(401).json({ message: "Token missing!" });
//       }

      const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
      req.user = decoded; 

     
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({ message: "Unauthorized!" });
      }

      next(); 
    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message });
    }
  };
};

export default auth;
