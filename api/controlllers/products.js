const Product = require("../models/product");
const mongoose = require("mongoose");


exports.products_get_all = (req, res, next) => { 
Product.find().select('name price _id ').exec().then(docs => {
    const response = {
        count: docs.length,
        products: docs.map(doc => { 
           return {
               name: doc.name,
               price: doc.price,
               _id: doc._id,
               productImage: doc.productImage,
               request: {
                  type: 'GET',
                  url: 'http://localhost:3000/products/' + doc._id
               }
           }  
     })
    };
    //console.log(docs);
    if(docs.length >= 0){
       res.status(200).json(response);
    } else {
       res.status(404).json({
          message: 'No entries found'
       });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({
       error: err
    });
  });
}



exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
     });
     product.save().then(result => {
        //console.log(result);
        res.status(200).json({
           message: 'Created product successfully',
           createdProduct: {
              name: result.name,
              price: result.price,
              _id: result._id,
              request: {
                 type: 'GET',
                 url: "http://localhost:3000/products/" + result._id
              }
           }
         });
     }).catch(err => {
        console.log(err);
        res.status(500).json({
           error: err
        });
     });
}


exports.get_product_by_id = (req, res, next) => {
    const id = req.params.productId;
   Product.findById(id).select('name price _id productImage').exec().then(doc => {
      console.log("From database", doc);
      if(doc){
         res.status(200).json({
            product: doc,
            request: {
               type: 'GET',
               description: 'Get all products',
               url: 'http://localhost:3000/products'
            }
         });
      } else{
         res.status(404).json({message: 'No valid entry for provided id'});
      }
   }).catch(err => {
      console.log(err);
      res.status(500).json({error: err});
   });
}


exports.update_products = (req, res, next) => {
    const id = req.params.productId;
   const updateOps = {};

   
      for (const ops of req.body){
         updateOps[ops.propName] = ops.value;
        }
        Product.updateOne({ _id: id }, { $set: updateOps }).exec().then(result => {
          console.log(result);
           res.status(200).json({
              message: 'Product Updated',
              request: {
                 type: 'GET',
                 url: 'http://localhost/products/' + id
              }
           });                  
        }).catch(err => {
         console.log(err);
           res.status(500).json({
            error: err
           });
        });
}


exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
   Product.deleteOne({ _id: id }).exec().then(result => {
      res.status(200).json({
         message: 'Product deleted',
         request: {
            type: 'POST',
            url: 'http://localhost:3000/products',
            body: { name: 'String', price: 'Number' }
         }    
      });
   }).catch(err => {
      console.log(err);
      res.status(500).json({ error: err});
   });
}
