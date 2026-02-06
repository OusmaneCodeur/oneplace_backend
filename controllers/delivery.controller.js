const Delivery = require('../models/DeliveryModel');

// Créer une nouvelle livraison
const createDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.create(req.body);
        res.status(201).json(delivery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer toutes les livraisons
const getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find()
            .populate('order')
            .sort({ createdAt: -1 });

        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour le statut d'une livraison
const updateDeliveryStatus = async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!delivery)
            return res.status(404).json({ message: 'Livraison introuvable' });

        res.json(delivery);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createDelivery, getDeliveries, updateDeliveryStatus };
