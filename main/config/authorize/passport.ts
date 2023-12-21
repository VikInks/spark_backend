import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import passport from "passport";
import {User} from "../../service/services/user/model/user.model";


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY ?? 'SECRET_KEY',
};

passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);

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