import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    // id de l'utilisateur, type d'image, avatar ou place de parking, nom de l'image, date de création, date de modification
    userId: { type: String, required: true },
    parkingId: { type: String, required: false },
    type: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: false }
});

imageSchema.pre('save', async function (next) {
    if (this.type === 'parking' && !this.parkingId) {
        throw new Error('Parking id is required');
    }
    next();
});

export default mongoose.model('Image', imageSchema);