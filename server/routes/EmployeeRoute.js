import express from 'express';
import { AddRecord } from '../controllers/RecordControllers.js';

const router = express.Router();

router.post('/api/addRecord', AddRecord);


export default router;
