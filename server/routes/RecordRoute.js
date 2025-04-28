import express from 'express';
import { addRecord, deleteRecord, getRecords, updateRecord } from '../controllers/RecordControllers.js';

const router = express.Router();

router.post('/api/addUser', addRecord);
router.get('/api/getUsers', getRecords);
router.put('/api/updateUser', updateRecord);
router.delete('/api/deleteUser', deleteRecord);

export default router;
