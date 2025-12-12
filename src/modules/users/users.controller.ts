import { Request, Response } from "express";
import { usersService } from "./users.service";



const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await usersService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      data: users,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong!",
    });
  }
};


const getSingleUser = async (req: Request, res: Response) => {
  try {
    const user = await usersService.getSingleUser(req.params.id!);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully!",
      data: user,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong!",
    });
  }
};


const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let updatedUser;

    if (loggedInUser.role === "admin") {
      // Admin can update any user
      updatedUser = await usersService.updateUser(userId as string, req.body);
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, message: "User updated by admin", data: updatedUser });

    } else if (loggedInUser.id === userId) {
      // User can update own account
      updatedUser = await usersService.updateUser(userId as string, req.body);
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, message: "Your account updated", data: updatedUser });

    } else {
      // Not allowed
      return res.status(403).json({ success: false, message: "You are not allowed to update this user" });
    }

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Something went wrong!" });
  }
};


const deleteUser = async (req: Request, res: Response) => {
try{
const result = await usersService.deleteUser(req.params.id!)
if(result.rowCount === 0){
  res.status(404).json({
    success: false,
    message: "No Users found",
    data: null
  })
}
else{
res.status(200).json({
    "success": true,
    "message": "User Deleted successfully",
  })
}
}catch(err: any){
  res.status(500).json({
  success: false,
  message: err.message
  })
}
}



export const usersController = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};