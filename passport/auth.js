import { Strategy as JWTstrategy } from 'passport-jwt'
import { ExtractJwt as ExtractJWT } from 'passport-jwt'

export default function (passport) {
  passport.use(
    new JWTstrategy(
      {
        secretOrKey: 'TOP_SECRET',
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
      },
      async (token, done) => {
        console.log('token.user:  ', token.user)
        try {
          return done(null, token.user)
        } catch (error) {
          done(error)
        }
      }
    )
  )
}
