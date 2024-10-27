const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getUsers = async (req, res, next) => {
    //#swagger.tags=['Users']
    console.log('start');
    const result = await mongodb.getDb().db('cse341-project2').collection('users').find();
    console.log('get result');
    result.toArray().then((list) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(list);
    });
    console.log('end')
};
const getUser = async (req, res, next) => {
    //#swagger.tags=['Users']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-project2').collection('users').find({_id: id});
    
        result.toArray().then((list) => {
            if (list.length === 0) return res.status(404).json({ message: 'User not found' });
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
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
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
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const editUser = async (req, res, next) => {
    //#swagger.tags=['Users']
    try {
        const id = new ObjectId(req.params.id);
        const existingUser = await mongodb.getDb().db('cse341-project2').collection('users').find({_id: id}).toArray();
        if (existingUser.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const User = {
            username: req.body.username || existingUser.username,
            email: req.body.email || existingUser.email,
            password: req.body.password || existingUser.password,
            birthday: req.body.birthday || existingUser.birthday
        };
        const result = await mongodb.getDb().db('cse341-project2').collection('users').replaceOne({_id: id}, User);
        
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