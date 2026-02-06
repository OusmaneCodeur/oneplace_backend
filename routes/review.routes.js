const express = require('express');
const {
    createReview,
    getReviewsByProduct,
    getAllReviews,
    updateReviewStatus,
    deleteReview
} = require('../controllers/review.controller');

const auth = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const router = express.Router();

// Créer un avis (client connecté)
router.post('/', auth, authorizeRoles('client', 'admin', 'moderator'), createReview);

// Récupérer les avis pour un produit spécifique (admin + moderator)
router.get('/product/:productId', auth, authorizeRoles('admin', 'moderator'), getReviewsByProduct);

// Récupérer tous les avis (admin seulement)
router.get('/', auth, authorizeRoles('admin'), getAllReviews);

// Mettre à jour le statut
router.patch('/:id/status', auth, authorizeRoles('admin', 'moderator'), updateReviewStatus);

// Supprimer un avis
router.delete('/:id', auth, authorizeRoles('admin', 'moderator'), deleteReview);

module.exports = router;
