const mongoose = require('mongoose');

// Schéma pour les livraisons des commandes
const deliverySchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            unique: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['en_preparation', 'en_cours', 'livree'],
            default: 'en_preparation'
        },
        estimatedDeliveryDate: { 
            type: Date,
            required: true,
            default: Date.now 
        },
        deliveredAt: {
            type: Date
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
