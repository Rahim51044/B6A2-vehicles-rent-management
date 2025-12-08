import { Request, Response } from "express";
import { pool } from "../../config/db";
import { vehiclesService } from "./vehicles.service";

const createVehicles = async (req: Request, res: Response) => {
  const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = req.body;
try{
const result = await vehiclesService.createVehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
  res.status(201).json({
    "success": true,
    "message": "Vehicles created successfully",
    data: result.rows[0]
  })
}catch(err: any){
  res.status(500).json({
  success: false,
  message: err.message
  })
}
}

const getVehicles = async (req: Request, res: Response) => {
try{
const result = await vehiclesService.getVehicles();
  res.status(200).json({
    "success": true,
    "message": "Vehicles fetched successfully",
    data: result.rows
  })
}catch(err: any){
  res.status(500).json({
  success: false,
  message: err.message
  })
}
}

const getSingleVehicle = async (req: Request, res: Response) => {
try{
const result = await vehiclesService.getSingleVehicle(req.params.vehicleId!)
if(result.rows.length === 0){
  res.status(404).json({
    success: false,
    message: "No vehicles found",
    data: result.rows[0]
  })
}
else{
res.status(200).json({
    "success": true,
    "message": "Vehicles created successfully",
    data: result.rows[0]
  })
}
}catch(err: any){
  res.status(500).json({
  success: false,
  message: err.message
  })
}
}


const updateVehicle = async (req: Request, res: Response) => {
const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = req.body;
try{
const result = await vehiclesService.updateVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.vehicleId!)

if(result.rows.length === 0){
  res.status(404).json({
    success: false,
    message: "No vehicles found",
    data: result.rows[0]
  })
}
else{
res.status(200).json({
    "success": true,
    "message": "Vehicle Updated successfully",
    data: result.rows[0]
  })
}
}catch(err: any){
  res.status(500).json({
  success: false,
  message: err.message
  })
}
}


const deleteVehicles = async (req: Request, res: Response) => {
try{
const result = await vehiclesService.deleteVehicles(req.params.vehicleId!)
if(result.rowCount === 0){
  res.status(404).json({
    success: false,
    message: "No vehicles found",
    data: result.rows[0]
  })
}
else{
res.status(200).json({
    "success": true,
    "message": "Vehicle Deleted successfully",
  })
}
}catch(err: any){
  res.status(500).json({
  success: false,
  message: err.message
  })
}
}



export const vehiclesController = {
  createVehicles,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicles
}