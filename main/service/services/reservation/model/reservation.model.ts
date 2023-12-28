import mongoose, {Schema} from "mongoose";

const reservationSchema = new Schema({
    userId: {type: String, required: true},
    parkingId: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    price: {type: Number, required: true},
    status: {type: String, required: true},
}, {timestamps: true});

const reservationHistorySchema = new Schema({
    userId: {type: String, required: true},
    parkingId: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    price: {type: Number, required: true},
    status: {type: String, required: true},
}, {timestamps: true});

export const ReservationHistory = mongoose.model('ReservationHistory', reservationHistorySchema);

export const Reservation = mongoose.model('Reservation', reservationSchema);