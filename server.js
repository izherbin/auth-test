/* eslint-disable import/extensions, import/no-extraneous-dependencies */
import cors from 'cors'
import express from 'express'
import { db } from './db.js'
import { corsOptions } from './config.js'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import passport from 'passport'
// import expressSession from 'express-session'
import jwt from 'jsonwebtoken'

const __dirname = path.resolve()

const app = express()
app.use(cors())

const port = process.env.PORT || 3000

const urlencodedParser = express.urlencoded({ extended: false })
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// app.use(expressSession({secret: 'mySecretKey', resave: false, saveUninitialized: false}));
app.use(passport.initialize())
// app.use(passport.session())

// Использование flash middleware обеспечиваемое connect-flash для записи сообщений в сессиях
// import flash from 'connect-flash';
// app.use(flash());

// Инициализация passport
import { initPassport } from './passport/init.js'
initPassport(passport)

app.get('/', cors(corsOptions), async (req, res) => {
  res.send('<h1>Привет сервер</h1>')
})

//* Выдача страницы регистрации
app.get('/signup', cors(corsOptions), async (req, res) => {
  res.sendFile('signup.html', { root: path.join(__dirname, 'views') })
})

//* Обработка Registration POST
app.post('/signup', cors(corsOptions), async (req, res, next) => {
  passport.authenticate(
    'signup',
    { session: false },
    async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error('Ошибка регистрации')
          res.status(409).json({ error: info })
          return next(error)
        } else {
          console.log('Пользователь зарегистрирован')
        }

        res.redirect(307, '/login')
      } catch (error) {
        return next(error)
      }
    }
  )(req, res, next)
})

//* Обработка Login POST
app.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    console.log('Попытка входа')
    try {
      if (err || !user) {
        const error = new Error('An error occurred.')
        res.status(401).json({ error: info.message })
        return next(error)
      }

      const body = {
        _id: user._id,
        username: user.username
      }
      const token = jwt.sign({ user: body }, 'TOP_SECRET')
      return res.json({ token })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

// Выдача секретной страницы
app
  .use(passport.authenticate('jwt', { session: false }))
  .get('/secret', cors(corsOptions), async (req, res) => {
    res.send(
      'If you read this ' + req.user.username + ' authenticated successfully'
    )
  })

app.listen(port, () => {
  console.log(`Сервер backend запущен на порту ${port}...`)
})
