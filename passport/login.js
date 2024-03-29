import LocalStrategy_ from 'passport-local'
let LocalStrategy = LocalStrategy_.Strategy
import users from '../models/users.js'
import bCrypt from 'bcrypt-nodejs'

export default function (passport) {
  passport.use(
    'login',
    new LocalStrategy(
      {
        // passReqToCallback: true
      },
      function (/*req, */ username, password, done) {
        // Проверить, есть ли такой пользователь в БД
        users.findOne({ username: username }, function (err, user) {
          // Если ошибка вернуть done с ней
          if (err) return done(err)
          // Если такого пользователя нет, то логировать ошибку и сделать redirect назад
          if (!user) {
            console.log('User Not Found with username ' + username)
            return done(null, false, 'User Not Found with username ' + username)
          }
          // Если пользователь есть, но пароль не совпадает, то логировать ошибку
          if (!isValidPassword(user, password)) {
            console.log('Invalid Password')
            return done(null, false, 'Invalid Password') // redirect back to login page
          }
          // Если пользователь и пароль совпадают возвращаем done и считаем, что жизнь удалась
          return done(null, user)
        })
      }
    )
  )

  const isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password)
  }
}
