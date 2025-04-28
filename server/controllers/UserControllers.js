import { User } from '../models/User.js';
import { connectDB, disconnectDB } from '../config/db.js';

export const createUser = async (req, res) => {
    try {
        await connectDB();

        const { PhoneNumber, Organization, FullName, Role } = req.body;

        const existingUser = await User.findOne({ PhoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this phone number already exists' });
        }

        const newUser = new User({
            PhoneNumber,
            Organization,
            FullName,
            Role
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully!', user: newUser });
    } catch (err) {
        res.status(400).json({ message: 'Error creating user', error: err.message });
    } finally {
        await disconnectDB();
    }
};

export const getUsers = async (req, res) => {
    try {
        await connectDB();

        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching users', error: err.message });
    } finally {
        await disconnectDB();
    }
};

export const getUserById = async (req, res) => {
    try {
        await connectDB();

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching user', error: err.message });
    } finally {
        await disconnectDB();
    }
};

export const updateUser = async (req, res) => {
    try {
        await connectDB();

        const { PhoneNumber, Organization, FullName, Role } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (PhoneNumber !== user.PhoneNumber) {
            const existingUser = await User.findOne({ PhoneNumber });
            if (existingUser) {
                return res.status(400).json({ message: 'Phone number already in use by another user' });
            }
        }

        user.PhoneNumber = PhoneNumber || user.PhoneNumber;
        user.Organization = Organization || user.Organization;
        user.FullName = FullName || user.FullName;
        user.Role = Role || user.Role;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(400).json({ message: 'Error updating user', error: err.message });
    } finally {
        await disconnectDB();
    }
};

export const deleteUser = async (req, res) => {
    try {
        await connectDB();

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting user', error: err.message });
    } finally {
        await disconnectDB();
    }
};
