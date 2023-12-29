import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
    userId: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
}, { _id: false });

const parkingSchema = new mongoose.Schema({
    ownerId: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 32 },
    price: { type: Number, required: true },
    electricCharger: { type: Boolean, default: false },
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

const historyParkingSchema = new mongoose.Schema({
    ownerId: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 32 },
    price: { type: Number, required: true },
    geoLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true },
    },
    description: String,
    evaluation: [evaluationSchema],
    imagePaths: [String],
    capacity: { type: Number, required: true },
    active: { type: Boolean, default: false },
}, { timestamps: true });

parkingSchema.index({ 'geoLocation.coordinates': '2dsphere' });

export const History = mongoose.model('History', historyParkingSchema);

export const Parking = mongoose.model('Parking', parkingSchema);
