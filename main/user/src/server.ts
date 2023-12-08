//server.ts
import express from 'express';
import http from 'http';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {typeDefs} from './application/graphql/typeDefs';
import {resolvers} from './application/graphql/resolvers';
import mongoose from 'mongoose';
import {createClient} from 'redis';
import bodyParser from 'body-parser';
import jwt, {JwtPayload} from "jsonwebtoken";
import cookieParser from "cookie-parser";


const REDIS_URL = process.env.REDIS_URL || 'redis://redis-server:6379';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://user-db:27017/user-service';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-session-secret';

async function configureRedis() {
    const redisClient = createClient({url: REDIS_URL});
    await redisClient.connect();
    return new connectRedis({client: redisClient});
}

function configureSession(redisStore: connectRedis) {
    return session({
        store: redisStore,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000 // 1 hour
        }
    });
}

function configureCors() {
    return cors({
        origin: 'http://localhost:5173',
        credentials: true
    });
}

function manageJwtCookie({req, res}: { req: express.Request, res: express.Response }, token?: string) {
    const cookieValue = token ? `jwt=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}` : 'jwt=; HttpOnly; Path=/; Max-Age=0';
    res.setHeader('Set-Cookie', cookieValue);
}

async function start() {
    require('./domain/config/passport');
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    const redisStore = await configureRedis();

    const app = express();
    app.use(bodyParser.json());
    app.use(configureSession(redisStore));
    app.use(configureCors());
    app.use(cookieParser());

    // Configuration d'ApolloServer
    const server = new ApolloServer({typeDefs, resolvers});
    await server.start();
    app.use('/', expressMiddleware(server, {
        context: async ({req, res}) => {
            const token = req.cookies['jwt'] || '';
            console.log('token: ', token)
            let userId = null;

            try {
                if (token) {
                    const decoded = jwt.verify(token, process.env.SECRET_KEY ?? 'SECRET_KEY') as JwtPayload;
                    userId = decoded.id;
                }
            } catch (error) {
                console.log('Error in ApolloServer context:', error);
                manageJwtCookie({req, res});
            }

            return {req, res, userId};
        }
    }));

    const httpServer = http.createServer(app);
    httpServer.listen({port: 4001}, () => {
        console.log('🚀 Server ready at http://localhost:4001/');
    });
}

start().then(() => console.log('Server User Service started!'));
