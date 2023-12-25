import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    parkingId: { type: String, required: false },
    type: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

imageSchema.pre('save', async function (next) {
    if (this.type === 'parking' && !this.parkingId) {
        throw new Error('Parking id is required');
    }
    next();
});

export default mongoose.model('Image', imageSchema);