const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Сериализация пользователя
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Десериализация пользователя
passport.deserializeUser((id, done) => {
  const user = users.find(user => user.id === id);
  done(null, user);
});

// Локальная стратегия аутентификации
passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(user => user.username === username && user.authType === 'local');
  if (!user) {
    return done(null, false, { message: 'Incorrect username' });
  }

  bcrypt.compare(password, user.passwordHash, (err, isMatch) => {
    if (err) return done(err);
    if (isMatch) return done(null, user);
    return done(null, false, { message: 'Incorrect password' });
  });
}));

module.exports = passport;