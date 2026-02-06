const Review = require('../models/ReviewModel');

// Créer un nouvel avis
const createReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer les avis pour un produit spécifique
const getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'nom prenom')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer tous les avis (admin seulement)
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'nom prenom')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ⚠️ Mettre à jour le statut d'un avis
const updateReviewStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Avis introuvable" });

        review.status = status;
        await review.save();

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ⚠️ Supprimer un avis
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Avis introuvable" });

        await review.remove();
        res.json({ message: "Avis supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getReviewsByProduct,
    getAllReviews,
    updateReviewStatus,
    deleteReview
};
