import express, { Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";



const app = express()
const port = config.port;
// parse
app.use(express.json());

// Initializing DB
initDB();

app.get('/', (req:Request, res:Response) => {
  res.send('Vehicle Rent Management')
})

app.use('/api/v1/vehicles', vehicleRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/bookings', bookingRoutes )




// Endpoin Users
app.post("/users", async (req: Request, res: Response) => {
  const {name, email, password, phone, role} = req.body;
try{
const result = await pool.query(
  `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, password, phone, role]
)
  res.status(201).json({
    "success": true,
    "message": "User registered successfully",
    data: result.rows[0]
  })
}catch(err: any){
  res.status(500).json({
  success: false,
  message: err.message
  })
}
})






app.use((req, res)=>{
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path
  })
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

