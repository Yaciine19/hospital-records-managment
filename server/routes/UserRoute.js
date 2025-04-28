import express from 'express';
import { deleteUser, getUsers, updateUser } from '../controllers/UserControllers.js';
import { registerUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/api/addUser', registerUser);
router.get('/api/getUsers', getUsers);
router.put('/api/updateUser', updateUser);
router.delete('/api/deleteUser', deleteUser);

export default router;
