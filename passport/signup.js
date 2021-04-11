import LocalStrategy_ from 'passport-local';
let LocalStrategy = LocalStrategy_.Strategy;
import users from '../models/users.js';
import bCrypt  from 'bcrypt-nodejs';

export default function(passport){
	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // Позволяет отправить запрос целиком в callback
        }, function(req, login, password, done) {
            console.log('Объявлена регистрация');
            // Найти пользователя в БД с таким login
            users.findOne({ 'login' :  login }, function(err, user) {
                // Если ошибка вернуть done с ней
                if (err) {
                    console.log('Error in SignUp: '+err);
                    return done(err);
                }
                // Если такой пользователь уже существует
                if (user) {
                    console.log('User already exists with username: '+username);
                    return done(null, false, req.flash('message','User Already Exists'));
                } else {
                    // Если нет пользователя с таким login, то создать его
                    var newUser = new users();

                    //* Ввод данных о пользователе
                    //TODO Добавить новые данные, согласовав с фронтом
                    newUser.login = login;
                    newUser.password = password;
                    // newUser.email = req.param('email');
                    // newUser.firstName = req.param('firstName');
                    // newUser.lastName = req.param('lastName');

                    // Сохранить пользователя
                    newUser.save(function(err) {
                        if (err){
                            console.log('Error in Saving user: '+err);  
                            throw err;  
                        }
                        console.log('User Registration succesful');    
                        return done(null, newUser);
                    });
                }
            });
            //TODO Сделать задержку до следующего цикла событий
        })
    );

    //TODO Сделать хэш пароля
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}