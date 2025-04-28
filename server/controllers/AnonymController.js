import Anonym from '../models/Anonym.js';
import { connectDB, disconnectDB } from '../config/db.js';

export const createAnonym = async (data) => {
    try {
        await connectDB();
        const { BirthDate, City, Wilaya, Gender, SignedBy, DateOfDeath, PlaceOfDeath, CauseOfDeath } = data;
        const newAnonym = new Anonym({
            BirthDate,
            City,
            Wilaya,
            Gender,
            SignedBy,
            DateOfDeath,
            PlaceOfDeath,
            CauseOfDeath
        });
        await newAnonym.save();
    } catch (error) {
        console.error('Error creating anonym:', error.message);
        throw new Error('Error creating anonym record');
    } finally {
        await disconnectDB();
    }
};

export const getAnonyms = async (req, res) => {
    try {
        await connectDB();
        const anonymRecords = await Anonym.find();
        res.status(200).json(anonymRecords);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching anonym records', error: err.message });
    } finally {
        await disconnectDB();
    }
};

export const getAnonymById = async (req, res) => {
    try {
        await connectDB();
        const anonym = await Anonym.findById(req.params.id);
        if (!anonym) {
            return res.status(404).json({ message: 'Anonym record not found' });
        }
        res.status(200).json(anonym);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching anonym record', error: err.message });
    } finally {
        await disconnectDB();
    }
};

export const updateAnonym = async (req, res) => {
    try {
        await connectDB();
        const { BirthDate, City, Wilaya, Gender, SignedBy, DateOfDeath, PlaceOfDeath, CauseOfDeath } = req.body;
        const anonym = await Anonym.findById(req.params.id);
        if (!anonym) {
            return res.status(404).json({ message: 'Anonym record not found' });
        }
        anonym.BirthDate = BirthDate || anonym.BirthDate;
        anonym.City = City || anonym.City;
        anonym.Wilaya = Wilaya || anonym.Wilaya;
        anonym.Gender = Gender || anonym.Gender;
        anonym.SignedBy = SignedBy || anonym.SignedBy;
        anonym.DateOfDeath = DateOfDeath || anonym.DateOfDeath;
        anonym.PlaceOfDeath = PlaceOfDeath || anonym.PlaceOfDeath;
        anonym.CauseOfDeath = CauseOfDeath || anonym.CauseOfDeath;
        await anonym.save();
        res.status(200).json({ message: 'Anonym record updated successfully', anonym });
    } catch (err) {
        res.status(400).json({ message: 'Error updating anonym record', error: err.message });
    } finally {
        await disconnectDB();
    }
};

export const deleteAnonym = async (req, res) => {
    try {
        await connectDB();
        const anonym = await Anonym.findByIdAndDelete(req.params.id);
        if (!anonym) {
            return res.status(404).json({ message: 'Anonym record not found' });
        }
        res.status(200).json({ message: 'Anonym record deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting anonym record', error: err.message });
    } finally {
        await disconnectDB();
    }
};
