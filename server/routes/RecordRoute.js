import express from 'express';
import { addRecord, deleteRecord, getRecords, updateRecord } from '../controllers/RecordControllers.js';

const router = express.Router();

router.post('/api/addRecord', addRecord);
router.get('/api/getRecords', getRecords);
router.put('/api/updateRecord', updateRecord);
router.delete('/api/deleteRecord', deleteRecord);

export default router;
