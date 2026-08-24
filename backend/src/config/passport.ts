import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";
import {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  updateUser,
} from "../repositories/userRepository";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account does not have an email"));
        }

        const googleId = profile.id;
        const name = profile.displayName;
        const avatarUrl = profile.photos?.[0]?.value ?? null;

        let user = await findUserByGoogleId(googleId);

        if (!user) {
          user = await findUserByEmail(email);

          if (user) {
            user = await updateUser(user.id, {
              googleId,
              name,
              avatarUrl,
            });
          }
        }

        if (!user) {
          user = await createUser({
            googleId,
            name,
            email,
            avatarUrl,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id as string);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;