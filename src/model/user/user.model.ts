import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const car = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 32 },
    brand: { type: String, required: true, trim: true, maxlength: 32 },
    model: { type: String, required: true, trim: true, maxlength: 32 },
    type: { type: String, required: true },
    plug: { type: String },
}, { timestamps: true });


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true, maxlength: 32 },
    lastName: { type: String, required: true, trim: true, maxlength: 32 },
    email: { type: String, required: true, trim: true, unique: true },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
    cars: { type: [car] },
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
    active: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    this.cars?.map((car) => {
        if (car.type === 'electric' && !car.plug) {
            throw new Error('Electric cars must have a plug type selected !');
        }
    })
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        ret.cars?.map((car: any) => {
            car.id = car._id;
            delete car._id;
        });
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
