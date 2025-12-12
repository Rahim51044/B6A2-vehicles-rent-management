
import { pool } from "../../config/db";

const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number
) => {
  const result = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );
  return result.rows[0];
};

const getAllBookings = async (role: string, userId: number) => {
  if (role === "admin") {
    const result = await pool.query(`
      SELECT b.*, u.name AS customer_name, u.email AS customer_email, 
             v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.rent_start_date DESC
    `);
    return result.rows;
  }

  // own bookings
  const result = await pool.query(
    `
    SELECT b.*, v.vehicle_name, v.registration_number, v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id=$1
    ORDER BY b.rent_start_date DESC
  `,
    [userId]
  );

  return result.rows;
};

const updateBookingStatus = async (bookingId: number, status: string) => {
  const result = await pool.query(
    `
    UPDATE bookings SET status=$1, updated_at=NOW()
    WHERE id=$2
    RETURNING *
  `,
    [status, bookingId]
  );

  return result.rows[0];
};

export const bookingsService = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
};
