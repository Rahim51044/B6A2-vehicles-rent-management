import { pool } from "../../config/db";

const stripPassword = (user: any) => {
  delete user.password;
  return user;
};


// const getAllUsers = async () => {
//   const res = await pool.query(`
//     SELECT id, name, email, phone, role, created_at
//     FROM users
//     ORDER BY id DESC
//   `);
//   return res.rows;
// };

const getAllUsers = async () => {
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result.rows;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users WHERE id=$1`, [id]);
  return result.rows[0];
};



const updateUser = async (id: string, data: { name?: string; email?: string; phone?: string; role?: string }) => {
  const fields = Object.keys(data);
  if (fields.length === 0) return null;

  const setQuery = fields.map((field, idx) => `${field}=$${idx + 1}`).join(", ");
  const values = Object.values(data);

  const result = await pool.query(
    `UPDATE users SET ${setQuery} WHERE id=$${fields.length + 1} RETURNING id, name, email, phone, role`,
    [...values, id]
  );

  return result.rows[0];
};

const deleteUser = async(id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`,[id])
  return result;
}


export const usersService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};