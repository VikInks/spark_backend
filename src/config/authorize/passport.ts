import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import passport from "passport";
import {findUserById} from "../../data_access/user/user.dal";


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY ?? 'SECRET_KEY',
};

passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
        try {
            const user = await findUserById(jwt_payload.id);

            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            console.error(error);
            return done(error, false);
        }
    })
);
