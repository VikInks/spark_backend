import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true, maxlength: 32 },
    lastName: { type: String, required: true, trim: true, maxlength: 32 },
    email: { type: String, required: true, trim: true, unique: true },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: {
        address: { type: String, required: true, trim: true, maxlength: 32 },
        city: { type: String, required: true, trim: true, maxlength: 32 },
        state: { type: String, required: true, trim: true, maxlength: 32 },
        zip: { type: String, required: true, trim: true, maxlength: 32 },
        country: { type: String, required: true, trim: true, maxlength: 32 },
    },
    avatar: { type: String, trim: true },
    active: { type: Boolean, default: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
