const express = require('express');
const {
    createDelivery,
    getDeliveries,
    updateDeliveryStatus
} = require('../controllers/delivery.controller');

const auth = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const router = express.Router();

// Créer une nouvelle livraison (admin uniquement)
router.post('/', auth, authorizeRoles('admin'), createDelivery);

// Mettre à jour le statut d'une livraison (admin uniquement)
router.put('/:id', auth, authorizeRoles('admin'), updateDeliveryStatus);

// Récupérer toutes les livraisons (admin uniquement)
router.get('/', auth, authorizeRoles('admin'), getDeliveries);

module.exports = router;
