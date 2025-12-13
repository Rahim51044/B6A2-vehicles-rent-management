
import { Request, Response } from "express";
import { pool } from "../../config/db";
import { bookingsService } from "./bookings.service";

// Create booking
const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

    // Check vehicle availability
    const vehicleRes = await pool.query(
      `SELECT daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
      [vehicle_id]
    );

    if (vehicleRes.rows.length === 0)
      return res.status(404).json({ success: false, message: "You are not created post" });

    const vehicle = vehicleRes.rows[0];

    if (vehicle.availability_status === "booked")
      return res.status(400).json({ success: false, message: "vehicle booked" });

    // Calculatetotal price
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const total_price = vehicle.daily_rent_price * days;

    // Create booking
    const booking = await bookingsService.createBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price
    );

    await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [
      vehicle_id,
    ]);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getAllBookings = async (req: Request, res: Response) => {
  try {
    const role = req.user!.role; 
    const userId = req.user!.id;

    const bookings = await bookingsService.getAllBookings(role, userId);

    res.status(200).json({
      success: true,
      message:
        role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: bookings,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const updateBooking = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const bookingId = Number(req.params.bookingId);

    const updatedBooking = await bookingsService.updateBookingStatus(
      bookingId,
      status
    );

    if (!updatedBooking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found!" });

    if (status === "returned" || status === "cancelled") {
      await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [
        updatedBooking.vehicle_id,
      ]);
    }

    const message =
      status === "returned"
        ? "Booking marked as returned. Vehicle is now available"
        : `Booking ${status} successfully`;

    res.status(200).json({
      success: true,
      message,
      data: updatedBooking,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const bookingsController = {
  createBooking,
  getAllBookings,
  updateBooking,
};



