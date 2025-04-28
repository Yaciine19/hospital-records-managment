import express from 'express';
import { addRecord, deleteRecord, getRecords, updateRecord } from '../controllers/RecordControllers.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/api/addRecord', protect, addRecord);
router.get('/api/getRecords', getRecords);
router.put('/api/updateRecord', protect, updateRecord);
router.delete('/api/deleteRecord', protect, deleteRecord);

export default router;
