import { connectDB, disconnectDB } from "../config/db.js"
import { Record } from '../models/Record.js'

export const getRecords = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.log(error.message);
    } finally {
        await disconnectDB();
    }
}

export const AddRecord = async (req, res) => {
    try {
        const newUser = new Record({
            LatinFullName: 'شهاب',
            ArabicFullName: 'chiheb',
            City: 'bougaa',
            Wilaya: 'setif',
            Gender: 'Male'
        });
        console.log(req.body);
        newUser.save()
            .then(() => console.log('Record created'))
    } catch (error) {
        console.log(error.message);
    } finally {
        await disconnectDB();
    }
}