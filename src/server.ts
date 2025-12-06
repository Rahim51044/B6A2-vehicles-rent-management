import express, { Request, Response } from "express";
import {Pool} from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")});


const app = express()
const port = 5000;

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`
})
// parse
app.use(express.json());


// BD
const initDB = async ()=> {
  // users
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
`);

// Vehicles
await pool.query(`
  CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(150) NOT NULL,
  type VARCHAR(50) NOT NULL,
  registration_number VARCHAR(100) NOT NULL UNIQUE,
  daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price >= 0),
  availability_status VARCHAR(20) NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
  `);

  // Bokings
await pool.query(`
  CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
  `)
}
initDB();

app.get('/', (req:Request, res:Response) => {
  res.send('Vehicle Rent Management')
})


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


// Endpoint Vehicles
app.post("/vehicles", async (req: Request, res: Response) => {
  const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = req.body;
try{
const result = await pool.query(
  `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]
);
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
})


app.get("/vehicles", async (req: Request, res: Response) => {
try{
const result = await pool.query(`SELECT * FROM vehicles`);
  res.status(200).json({
    "success": true,
    "message": "Vehicles created successfully",
    data: result.rows
  })
}catch(err: any){
  res.status(500).json({
  success: false,
  message: err.message
  })
}
})


app.get("/vehicles/:vehicleId", async (req: Request, res: Response) => {
try{
const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`,[req.params.vehicleId]);
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
})


app.put("/vehicles/:vehicleId", async (req: Request, res: Response) => {
const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = req.body;
try{
const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,[vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.vehicleId]);

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
})


app.delete("/vehicles/:vehicleId", async (req: Request, res: Response) => {
try{
const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`,[req.params.vehicleId]);
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

