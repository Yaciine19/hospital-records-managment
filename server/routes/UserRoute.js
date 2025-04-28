import express from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/UserControllers.js';

const router = express.Router();

router.post('/api/addUser', createUser);
router.get('/api/getUsers', getUsers);
router.put('/api/updateUser', updateUser);
router.delete('/api/deleteUser', deleteUser);


export default router;
