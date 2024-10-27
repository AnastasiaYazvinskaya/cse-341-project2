const mongodb = require('../data/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;

const registerUser = async (req, res, next) => {
    //#swagger.tags=['Auth']
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const existingUser = await mongodb.getDb().db('cse341-project2').collection('users').findOne({ email: req.body.email });
        if (!existingUser) {
            const newUser = {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                birthday: req.body.birthday,
                authType: 'local'
            };
            const result = await mongodb.getDb().db('cse341-project2').collection('users').insertOne(newUser);
            
            if (result.acknowledged) {
                console.log(`New User created with the following id: ${result.insertedId}`);
                res.status(201).json(result);
            } else {
                res.status(500).json(result.error || 'User creation failed');
            }
        } else {
            res.status(400).json('User with these email already exist');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};

const oauthUser = async (req, res) => {
    try {
        const { email, name } = req.oidc.user; // Assuming oidc gives us these
        const existingUser = await mongodb.getDb().db('cse341-project2').collection('users').findOne({ email: email });
        if (!existingUser) {
            const newUser = {
                email: email,
                authType: 'oauth',
                username: email.split("@")[0],
                birthday: null,
                password: null
            };

            const result = await mongodb.getDb().db('cse341-project2').collection('users').insertOne(newUser);
            console.log(`User created with OAuth: ${result.insertedId}`);
        }

        // Redirect to homepage or desired route after login
        res.redirect('/');
    } catch (err) {
        res.status(500).json({ message: 'Error handling OAuth callback', error: err.message });
    }
};
const loginUser = async (req, res) => {
    //#swagger.tags=['Auth']
    res.oidc.login({
        returnTo: '/oauth'
    });
}
const loginLocalUser = async (req, res, next) => {
    //#swagger.tags=['Auth']
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    try {
        // Ищем пользователя в базе данных
        const user = await await mongodb.getDb().db('cse341-project2').collection('users').findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        // Если аутентификация успешна, сохраняем данные пользователя в сессии
        req.session.user = {
            id: user._id,
            email: user.email,
            authType: 'local' // Указываем тип авторизации
        };

        // Можно добавить аналогичный объект, чтобы "имитировать" поведение res.oidc
        req.oidc = {
            isAuthenticated: true,
            user: req.session.user
        };

        return res.status(200).json({ message: 'Успешный логин', user: req.session.user });

    } catch (error) {
        return res.status(500).json({ message: 'Ошибка сервера', error });
    }
    /*const email = req.body.email;
    const password = req.body.password;
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
        req.login(user, (loginErr) => {
          if (loginErr) return next(loginErr);
          return res.status(200).json({ message: 'Successfully logged in', user });
        });
      })(req, res, next);*/
    /*const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await mongodb.getDb().db('cse341-project2').collection('users').findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Compare the password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Create a JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        // Send the token and user data in response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }*/
}

const logoutUser = async (req, res) => {
    //#swagger.tags=['Auth']
    console.log('start');
    /*res.oidc.logout({
        returnTo: 'http://localhost:3001/'
    });*/
    req.session = null;
    res.clearCookie('connect.sid')
    res.redirect('/');

}

module.exports = { registerUser, oauthUser, loginUser, loginLocalUser, logoutUser};