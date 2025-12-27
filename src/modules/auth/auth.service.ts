
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import config from "../../config";
import { pool } from "../../config/db";

const createUser = async (payload:Record<string, unknown>) => {
  const {name, email, password, phone, role} = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);

const result = await pool.query(
  `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, 
  [name, email, hashedPassword, phone, role]
)
return result.rows[0];
}


const signin = async (email: string, password: string) => {
  if (!email || !password) 
  throw new Error("Email and password required");

  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()]);
  const user = result.rows[0];
  if (!user) 
  throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) 
  throw new Error("Invalid credentials");

  //  const token = jwt.sign(
  //   { name: user.name, email: user.email, role: user.role },
  //   config.jwtSecret as string,
  //   {
  //     expiresIn: "365d",
  //   }
  // );

    const token = jwt.sign(
    {
      id: user.id,        
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret as string,
    {
      expiresIn: "365d",
    }
  );


return {token, user};

};


export const authServices = {
  createUser,
  signin
}