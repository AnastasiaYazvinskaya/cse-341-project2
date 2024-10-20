const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getUsers = async (req, res, next) => {
    //#swagger.tags=['Users']
    const result = await mongodb.getDb().db('cse341-project2').collection('users').find();
    result.toArray().then((list) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(list);
    });
};
const getUser = async (req, res, next) => {
    //#swagger.tags=['Users']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-project2').collection('users').find({_id: id});
        console.log('result', result);
        if (!result) return res.status(404).json({ message: 'User not found' });
        result.toArray().then((list) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(list[0]);
        });
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const addUser = async (req, res, next) => {
    //#swagger.tags=['Users']
    try {
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            birthday: req.body.birthday
        };
        const result = await mongodb.getDb().db('cse341-project2').collection('users').insertOne(newUser);
        
        if (result.acknowledged) {
            console.log(`New User created with the following id: ${result.insertedId}`);
            res.status(201).json(result);
        } else {
            res.status(500).json(result.error || 'User creation failed');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const editUser = async (req, res, next) => {
    //#swagger.tags=['Users']
    try {
        const id = new ObjectId(req.params.id);
        const existingUser = await User.findById(id);
        if (!existingUser) return res.status(404).json({ message: 'User not found' });
        
        const User = {
            firstName: req.body.firstName || existingUser.firstName,
            lastName: req.body.lastName || existingUser.lastName,
            email: req.body.email || existingUser.email,
            password: req.body.password || existingUser.password,
            birthday: req.body.birthday || existingUser.birthday
        };
        const result = await mongodb.getDb().db('cse341-project2').collection('users').replaceOne({_id: id}, User);
        if (result.matchedCount == 0) return res.status(404).json({ message: 'User not found' });
        if (result.modifiedCount > 0) {
            console.log(`User updated with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Somethng goes wrong');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const deleteUser = async (req, res, next) => {
    //#swagger.tags=['Users']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-project2').collection('users').deleteOne({_id: id});
        if (result.deletedCount > 0) {
            console.log(`User deleted with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Somethng goes wrong');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};

module.exports = { getUsers, getUser, addUser, editUser, deleteUser };