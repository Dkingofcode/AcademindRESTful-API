const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


mongoose.connect(
  "mongodb+srv://kdavidmongoose2001A:" + process.env.MONGO_ATLAS_PW + "@cluster0.xdmae.mongodb.net/nodeAPIDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  }).then(() => {
    console.log('Connected to MongoDB Atlas')
    // Continue with your application logic
  }).catch((error) => {
     console.log('Error connecting to MongoDB Atlas', error)
  });

 mongoose.Promise = global.Promise; 

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", 
  "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
    next();   
});


//Routes that should handle requests 
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use("/user", userRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})


app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
        message: error.message
    }
  })
})


module.exports = app;









