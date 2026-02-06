const express = require('express');
const router = express.Router();
const upload = require("../middlewares/upload.middleware");


const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');

const auth = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

//Routes publiques pour récupérer les produits
router.get('/', getProducts);
router.get('/:id', getProductById);

//Routes pour créer et modifier des produits (admin et modérateur)
router.post('/new-product', auth, authorizeRoles('admin', 'moderator'), upload.single("image"), createProduct);
router.put('/:id', auth, authorizeRoles('admin', 'moderator'), updateProduct);
router.delete('/:id', auth, authorizeRoles('admin', 'moderator'), deleteProduct);

module.exports = router; 
