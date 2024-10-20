const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getItems = async (req, res, next) => {
    //#swagger.tags=['Items']
    const result = await mongodb.getDb().db('cse341-project2').collection('items').find();
    result.toArray().then((list) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(list);
    });
};
const getItem = async (req, res, next) => {
    //#swagger.tags=['Items']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-project2').collection('items').find({_id: id});
        if (!result) return res.status(404).json({ message: 'item not found' });
        result.toArray().then((list) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(list[0]);
        });
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const addItem = async (req, res, next) => {
    //#swagger.tags=['Items']
    try {
        const newItem = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock
        };
        const result = await mongodb.getDb().db('cse341-project2').collection('items').insertOne(newItem);
        
        if (result.acknowledged) {
            console.log(`New Item created with the following id: ${result.insertedId}`);
            res.status(201).json(result);
        } else {
            res.status(500).json(result.error || 'Item creation failed');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const editItem = async (req, res, next) => {
    //#swagger.tags=['Items']
    try {
        const id = new ObjectId(req.params.id);
        const existingItem = await mongodb.getDb().db('cse341-project2').collection('items').find({_id: id}).toArray();
        if (existingItem.length === 0) return res.status(404).json({ message: 'Item not found' });
        const Item = {
            name: req.body.name || existingItem.name,
            description: req.body.description || existingItem.description,
            price: req.body.price || existingItem.price,
            stock: req.body.stock || existingItem.stock
        };
        const result = await mongodb.getDb().db('cse341-project2').collection('items').replaceOne({_id: id}, Item);
        if (result.modifiedCount > 0) {
            console.log(`Item updated with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Somethng goes wrong');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const deleteItem = async (req, res, next) => {
    //#swagger.tags=['Items']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-project2').collection('items').deleteOne({_id: id});
        if (result.deletedCount > 0) {
            console.log(`Item deleted with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Somethng goes wrong');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};

module.exports = { getItems, getItem, addItem, editItem, deleteItem };