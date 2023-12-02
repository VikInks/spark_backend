import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Code for the routes for inscription and connection

/**
 * @route POST /api/auth/signup
 * @desc function to get the token for a session
 * @param id
 * @returns {string} token
 * @author VikInks
 */
const signToken = (id: string): string => {
    return jwt.sign(
        {
            iss: 'Secret',
            sub: id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 1),
        },
        process.env.SECRET ?? 'SECRET_KEY'
    );
}



export default router;