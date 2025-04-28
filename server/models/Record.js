import mongoose, { Mongoose } from "mongoose"

const RecordSchema = new mongoose.Schema({
    ArabicFullName: {
        type: String,
        required: true,
    },
    ArabicFullName: {
        type: String,
        required: true,
    },
    BirthDate: {
        type: Date,
        default: Date.now(),
    },
    City: {
        type: String,
        required: true,
    },
    Wilaya: {
        type: String,
        required: true,
    },
    Gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
    },
    Father: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record',
    },
    Mother: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record',
    }
})
module.exports = mongoose.model('Record', RecordSchema)