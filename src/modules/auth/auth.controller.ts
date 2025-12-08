import { Request, Response } from "express";
import {authServices } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    // const { name, email, password, phone, role } = req.body;
    const result = await authServices.createUser(req.body);
    res.status(201).json({ 
      success: true, 
      message: "User registered successfully", 
      data: result });
  } catch (err: any) {
    res.status(400).json({ 
      success: false,
      message: 
      err.message 
    });
  }
};

 const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authServices.signin(email, password);
    return res.status(200).json({ success: true, message: "Login successful", data: result });
  } catch (err: any) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

export const authController = {
  signup,
  signin
}