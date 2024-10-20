const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getOrders = async (req, res, next) => {
    //#swagger.tags=['Orders']
    const result = await mongodb.getDb().db('cse341-project2').collection('orders').find();
    result.toArray().then((list) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(list);
    });
};
const getOrder = async (req, res, next) => {
    //#swagger.tags=['Orders']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-project2').collection('orders').find({_id: id});
        if (!result) return res.status(404).json({ message: 'Order not found' });
        result.toArray().then((list) => {
            if (list.length === 0) return res.status(404).json({ message: 'User not found' });
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(list[0]);
        });
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const addOrder = async (req, res, next) => {
    //#swagger.tags=['Orders']
    try {
        const newOrder = {
            productID: req.body.productID,
            userID: req.body.userID,
            quantity: req.body.quantity,
            paymentMethod: req.body.paymentMethod,
            totalAmount: req.body.totalAmount,
            status: req.body.status,
            orderDate: req.body.orderDate
        };
        const result = await mongodb.getDb().db('cse341-project2').collection('orders').insertOne(newOrder);
        
        if (result.acknowledged) {
            console.log(`New Order created with the following id: ${result.insertedId}`);
            res.status(201).json(result);
        } else {
            res.status(500).json(result.error || 'Order creation failed');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const editOrder = async (req, res, next) => {
    //#swagger.tags=['Orders']
    try {
        const id = new ObjectId(req.params.id);
        const existingOrder = await mongodb.getDb().db('cse341-project2').collection('orders').find({_id: id}).toArray();
        if (existingOrder.length === 0) return res.status(404).json({ message: 'Order not found' });
        const Order = {
            productID: req.body.productID || existingOrder.productID,
            userID: req.body.userID || existingOrder.userID,
            quantity: req.body.quantity || existingOrder.quantity,
            paymentMethod: req.body.paymentMethod || existingOrder.paymentMethod,
            totalAmount: req.body.totalAmount || existingOrder.totalAmount,
            status: req.body.status || existingOrder.status,
            orderDate: req.body.orderDate || existingOrder.orderDate
        };
        const result = await mongodb.getDb().db('cse341-project2').collection('orders').replaceOne({_id: id}, Order);
    
        if (result.modifiedCount > 0) {
            console.log(`Order updated with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Somethng goes wrong');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};
const deleteOrder = async (req, res, next) => {
    //#swagger.tags=['Orders']
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('cse341-project2').collection('orders').deleteOne({_id: id});
        if (result.deletedCount > 0) {
            console.log(`Order deleted with the following id: ${id}`);
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Somethng goes wrong');
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
};

module.exports = { getOrders, getOrder, addOrder, editOrder, deleteOrder };