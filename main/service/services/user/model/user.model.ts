import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Represents a user schema used by mongoose to define the structure and validation rules for a user model.
 *
 * @typedef {Object} UserSchema
 *
 * @property {string} firstName - The first name of the user. Required, trimmed, and limited to 32 characters.
 * @property {string} lastName - The last name of the user. Required, trimmed, and limited to 32 characters.
 * @property {string} email - The email of the user. Required, unique, trimmed, and limited to 32 characters.
 * @property {string} phone - The phone number of the user. Required, trimmed, and limited to 32 characters.
 * @property {string} username - The username of the user. Required and unique.
 * @property {string} password - The password of the user. Required.
 * @property {Object} location - The location of the user.
 *     @property {string} address - The address of the user. Required, trimmed, and limited to 32 characters.
 *     @property {string} city - The city of the user. Required, trimmed, and limited to 32 characters.
 *     @property {string} state - The state of the user. Required, trimmed, and limited to 32 characters.
 *     @property {string} zip - The zip code of the user. Required, trimmed, and limited to 32 characters.
 *     @property {string} country - The country of the user. Required, trimmed, and limited to 32 characters.
 * @property {string} avatar - The avatar of the user. Trimmed.
 * @property {boolean} active - Indicates if the user is currently active. Defaults to true.
 * @property {Date} created - The date and time when the user was created. Defaults to the current date and time.
 * @property {Date} updated - The date and time when the user was last updated. Defaults to the current date and time.
 */
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
