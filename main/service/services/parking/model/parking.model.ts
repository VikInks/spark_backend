import mongoose from "mongoose";

const resScheduleSchema = new mongoose.Schema({
    userId: String,
    startTime: Date,
    endTime: Date,
    status: { type: String, enum: ['in use', 'pending', 'canceled', 'completed'] },
}, { _id: false });

const evaluationSchema = new mongoose.Schema({
    userId: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
}, { _id: false });

const parkingSchema = new mongoose.Schema({
    ownerId: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 32 },
    resSchedule: [resScheduleSchema],
    dispSchedule: [{
        startTime: Date,
        endTime: Date,
    }],
    price: { type: Number, required: true },
    geoLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true },
    },
    description: String,
    evaluation: [evaluationSchema],
    imagePaths: [String],
    capacity: { type: Number, required: true },
    active: { type: Boolean, default: true },
}, { timestamps: true });

parkingSchema.index({ 'geoLocation.coordinates': '2dsphere' });

export const Parking = mongoose.model('Parking', parkingSchema);
