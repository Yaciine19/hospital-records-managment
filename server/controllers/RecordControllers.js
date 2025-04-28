import { connectDB, disconnectDB } from "../config/db.js";
import Record from "../models/Record.js";
import { createAnonym } from "./AnonymController.js";

export const getRecords = async (req, res) => {
    try {
        await connectDB();
        const records = await Record.find();
        res.status(200).json(records);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    } finally {
        await disconnectDB();
    }
};

export const addRecord = async (req, res) => {
    try {
        await connectDB();

        const newRecord = new Record(req.body);

        await newRecord.save();
        await createAnonym(req.body);
        res.status(201).json({ message: "Manual record created successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    } finally {
        await disconnectDB();
    }
};

export const updateRecord = async (req, res) => {
    const { id } = req.params;
    try {
        await connectDB();
        const updatedRecord = await Record.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRecord) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    } finally {
        await disconnectDB();
    }
};

export const deleteRecord = async (req, res) => {
    const { id } = req.params;
    try {
        await connectDB();
        const deletedRecord = await Record.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    } finally {
        await disconnectDB();
    }
};
