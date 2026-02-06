const express = require('express');
const {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/order.controller');

const auth = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const router = express.Router();

// Création de commande (client)
router.post('/', auth, createOrder);

// Commandes du client connecté
router.get('/me', auth, getMyOrders);

// Admin : liste, détail, mise à jour statut, suppression
router.get('/', auth, authorizeRoles('admin'), getOrders);
router.get('/:id', auth, authorizeRoles('admin'), getOrderById);
router.put('/:id/status', auth, authorizeRoles('admin'), updateOrderStatus);
router.delete('/:id', auth, authorizeRoles('admin'), deleteOrder);

module.exports = router;
