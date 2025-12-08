
// import bcrypt from "bcryptjs";
// import { pool } from "../config/db";
// import config from "../config";
// import jwt from 'jsonwebtoken'


// const signin = async (email: string, password: string) => {

//   const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
//   if (result.rows.length === 0) 
//     return null;

//   const user = result.rows[0];

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) 
//     return false;

//   const token = jwt.sign(
//     { name: user.name, email: user.email, role: user.role },
//     config.jwtSecret as string,
//     { expiresIn: "7d" }
//   );

//   return { token, user };
// };

// export const authServices = { 
//   signin
// };



import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "You are not allowed!" });
      }

      // const token = authHeader.split(" ")[1]; 
         // "Bearer tokenvalue" → শুধু token অংশ নেবে
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;
      if (!token) {
        return res.status(401).json({ message: "Token missing!" });
      }

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
