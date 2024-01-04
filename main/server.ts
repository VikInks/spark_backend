import jwt from "jsonwebtoken";
import {ApolloServer} from '@apollo/server';
import express from 'express';
import {baseTypeDefs} from "./api/graphql/graphql_base/typeDefs.base";
import {resolvers as UserResolvers} from "./api/graphql/user/resolvers";
import {resolvers as ImageResolvers} from "./api/graphql/image/resolvers";
import {resolvers as ParkingResolvers} from "./api/graphql/parking/resolvers";
import {resolvers as ReservationResolvers} from "./api/graphql/reservation/resolvers";
import {typeDefs as UserType} from "./api/graphql/user/typeDefs";
import {typeDefs as ImageType} from "./api/graphql/image/typeDefs";
import {typeDefs as ParkingType} from "./api/graphql/parking/typeDefs";
import {typeDefs as ReservationType} from "./api/graphql/reservation/typeDefs";
import * as http from "http";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import {expressMiddleware} from "@apollo/server/express4";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import {configureCors} from "./config/cors";
import {contextType} from "./service/base/interface/contextType";
import {manageCookie} from "./utils/token.management";

const aggregateResolvers = [UserResolvers, ImageResolvers, ParkingResolvers, ReservationResolvers];
const aggregateTypeDefs = [baseTypeDefs, UserType, ImageType, ParkingType, ReservationType];

/**
 * Starts the server and establishes connections to MongoDB and Redis.
 *
 * @async
 * @return {Promise<void>} A Promise that resolves when the server is ready.
 */
async function start() {
    const app = express();

    // connection to mongodb
    await mongoose.connect('mongodb://db:27017/spark').then(
        () => {
            console.log('Connected to MongoDB');
        },
        (err) => {
            console.log('Failed to connect to MongoDB');
            console.log(err);
        }
    );

    require('./config/authorize/passport');
    app.use(configureCors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(bodyParser.json());

    const httpServer = http.createServer(app);

    const server = new ApolloServer<contextType>({
        typeDefs: aggregateTypeDefs,
        resolvers: aggregateResolvers,
        plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
    });

    await server.start();

    app.use(
        '/',
        expressMiddleware(server, {
            context: async ({req, res}: contextType) => {
                const token = req.headers.cookie?.split(';').find(c => c.trim().startsWith('jwt='))?.split('=')[1];
                let user = null;

                if (token) {
                    try {
                        user = jwt.verify(token, process.env.SECRET ?? 'SECRET_KEY') as string;
                        return {req, res, user};
                    } catch (error) {
                        console.error("Error while verifying token", error);
                        manageCookie(res);
                    }
                }

                return {req, res, user};

            }
        })
    )

    await new Promise<void>((resolve) => httpServer.listen({port: 4000}, resolve));
    console.log(`🚀 Server ready at http://localhost:4000`)
}

start().then(() => {
    console.log('Be proud of yourself, you can do it');
});