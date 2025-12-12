import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middlewere/auth";

const router = express.Router()

router.post('/', auth("admin"), vehiclesController.createVehicles)

router.get('/',  vehiclesController.getVehicles)

router.get('/:vehicleId', vehiclesController.getSingleVehicle )
router.put('/:vehicleId', auth("admin"), vehiclesController.updateVehicle )
router.delete('/:vehicleId', auth("admin"), vehiclesController.deleteVehicles )





export const vehicleRoutes = router;