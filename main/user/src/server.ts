import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import mongoose from 'mongoose';
import {typeDefs} from './application/graphql/typeDefs';
import {resolvers} from './application/graphql/resolvers';
import UserInterface from "./domain/interface/model/user.interface";
import jwt from "jsonwebtoken";
import {IncomingMessage, ServerResponse} from "http";


// Connexion à MongoDB
mongoose.connect('mongodb://user-db:27017/user-service').then(() => {
    console.log('Connected to MongoDB');
});

// Initialisation de Passport avec la stratégie JWT (à inclure à partir de votre configuration)
require('./domain/config/passport');

// Définition du type de contexte
interface ContextType {
    req: IncomingMessage;
    res: ServerResponse;
    user?: UserInterface | null;
}

// Création de l'instance Apollo Server
const server = new ApolloServer<ContextType>({
    typeDefs,
    resolvers,
});

// Fonction pour créer le contexte
async function createContext({ req, res }: { req: IncomingMessage, res: ServerResponse }): Promise<ContextType> {
    const token = req.headers.cookie?.split(';').find(c => c.trim().startsWith('jwt='))?.split('=')[1];
    let user = null;

    if (token) {
        try {
            user = jwt.verify(token, process.env.SECRET ?? 'SECRET_KEY') as UserInterface;
            // Supposons que votre objet UserInterface contienne un attribut id.
        } catch (error) {
            console.error("JWT Error:", error);
            // Si le token est invalide, vous pourriez vouloir nettoyer le cookie ici.
            res.setHeader('Set-Cookie', 'jwt=; HttpOnly; Path=/; Max-Age=0');
        }
    }

    return { req, res, user };
}

// Démarrage du serveur Apollo avec contexte
startStandaloneServer(server, {
    listen: { port: 4001 },
    context: createContext
}).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});