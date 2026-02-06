const mongoose = require('mongoose');

// Définition du schéma de la commande
const orderSchema = new mongoose.Schema(
    {
        client: { // Référence à l'utilisateur qui a passé la commande
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [ // Liste des produits dans la commande
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        montantTotal: {
            type: Number,
            required: true
        },
        adresseLivraison: {
            type: String,
            required: true
        },
        statut: {
            type: String,
            enum: ['en attente', 'validée', 'en préparation', 'expédiée', 'livrée', 'annulée'],
            default: 'en attente'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
