const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
import OrdersCOntroller from "../controlllers/orders";

// Handle incoming GET requests to /orders
router.get('/', )
    
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            res.status(404).json({
                message: "Product not found" 
            });
        }
        const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });

    return order.save()
}).then(result => {
    console.log(result);
   res.status(201).json({
       message: 'Order stored',
       createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity
       },
       request: {
         type: 'GET',
         url: 'http://localhost:3000/orders/' + result._id
       }
   });
}).catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
  });
});        
    
    
    
    
    
    
    
router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId).exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: "Oder not found"
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'     
        }
        }) 
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});    


router.delete('/:orderId', (req, res, next) => {
    Order.findByIdAndRemove({ _id: req.params.orderId }).exec()
    .then(result => {
        res.status(200).json({
           message: 'Order Deleted',
           request: {
              type: "POST",
              url: "http://localhost:3000/orders",
              body: { productId: "ID", quantity: "Number" }
            } 
        });
    });
});

module.exports = router;