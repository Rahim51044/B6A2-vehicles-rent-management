
import express from "express";
import auth from "../../middlewere/auth";
import { bookingsController } from "./bookings.controller";

const router = express.Router();

router.post("/", auth("admin", "customer"), bookingsController.createBooking);

router.get("/", auth("admin", "customer"), bookingsController.getAllBookings);

router.put("/:bookingId", auth("admin", "customer"), bookingsController.updateBooking);

export const bookingRoutes = router;
