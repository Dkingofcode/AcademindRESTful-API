const express = require('express');
const router = express.Router();
const multer = require('multer');
const ProductCtrl = require("../controlllers/products");
const checkAuth = require("../middleware/check-auth");
const storage = multer.diskStorage({
   destination: function(req, file, cb){
     cb(null, './uploads/');
   },
   filename: function(req, file, cb){
      cb(null, new Date().toISOString() + file.originalname)
   }
})

const upload = multer({dest: 'uploads/'});



const fileFilter = (req, file, cb) => {
   // reject a file
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
      cb(null, true);
   } else {
      cb(null, false);
   }
}

// const upload = multer({storage: storage, limits: {
//    fileSize: 1024 * 1024 * 5
// },  
//   fileFilter: fileFilter
// });


router.get('/', ProductCtrl.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductCtrl.products_create_product);

router.get('/:productId', ProductCtrl.get_product_by_id); 

router.patch('/:productId', checkAuth, ProductCtrl.update_products);

router.delete('/:productId', checkAuth, ProductCtrl.delete_product);



module.exports = router;