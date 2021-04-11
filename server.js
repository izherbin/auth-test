/* eslint-disable import/extensions, import/no-extraneous-dependencies */
import cors from 'cors';
import express from 'express';
import { db } from './db.js';
import { corsOptions } from './config.js';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import passport from 'passport'
import expressSession from 'express-session'

const __dirname = path.resolve();

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

const urlencodedParser = express.urlencoded({extended: false});
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(expressSession({secret: 'mySecretKey', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// Использование flash middleware обеспечиваемое connect-flash для записи сообщений в сессиях
import flash from 'connect-flash';
app.use(flash());

// Инициализация passport
import {initPassport} from './passport/init.js';
initPassport(passport);

app.get('/', cors(corsOptions), async (req, res) => {
  res.send('<h1>Привет сервер</h1>')
});

//* Выдача страницы регистрации
app.get('/signup', cors(corsOptions), async (req, res) => {
  res.sendFile('signup.html', {root: path.join(__dirname, 'views')})
});

//* Обработка Registration POST
app.post('/signup', cors(corsOptions), passport.authenticate('signup', {
  successRedirect: '/home',
  failureRedirect: '/signup',
  failureFlash : true  
}));

//* Выдача страницы login
app.get('/login', cors(corsOptions), async (req, res) => {
  res.sendFile('login.html', {root: path.join(__dirname, 'views')})
});

// app.post("/login", async (req, res) => {
//   console.log(' ~login', req.body);
//   if(!req.body) return res.sendStatus(400);
//   res.send(`Login:  ${req.body.username} - ${req.body.password}`);
// });

//* Обработка Login POST
app.post('/login', passport.authenticate('login', {
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash : true  
}));

// Выдача секретной страницы
app.get('/home', cors(corsOptions), async (req, res) => {
  res.sendFile('home.html', {root: path.join(__dirname, 'views')})
});

app.listen(port);
