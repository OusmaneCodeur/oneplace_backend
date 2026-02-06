const Order = require('../models/OrderModel');

// Map statut (FR) <-> status (EN) pour le frontend
const statutToStatus = {
    'en attente': 'pending',
    'validée': 'paid',
    'en préparation': 'preparing',
    'expédiée': 'shipped',
    'livrée': 'delivered',
    'annulée': 'cancelled'
};
const statusToStatut = {
    pending: 'en attente',
    paid: 'validée',
    preparing: 'en préparation',
    shipped: 'expédiée',
    delivered: 'livrée',
    cancelled: 'annulée'
};

function toApiOrder(order) {
    if (!order) return null;
    const doc = order.toObject ? order.toObject() : order;
    return {
        ...doc,
        user: doc.client,
        totalPrice: doc.montantTotal,
        status: statutToStatus[doc.statut] || doc.statut,
        items: doc.products,
        orderItems: doc.products
    };
}

// Créer une nouvelle commande
const createOrder = async (req, res) => {
    try {
        const body = req.body;
        const data = {
            client: body.client || body.userId,
            products: (body.products || body.items || body.orderItems || []).map((item) => ({
                product: item.product || item.productId,
                quantity: item.quantity || 1
            })),
            montantTotal: body.montantTotal ?? body.totalPrice ?? 0,
            adresseLivraison: body.adresseLivraison || body.shippingAddress || body.address || '',
            statut: body.statut || 'en attente'
        };
        const order = await Order.create(data);
        res.status(201).json(toApiOrder(order));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer toutes les commandes (admin)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('client')
            .populate('products.product')
            .sort({ createdAt: -1 });

        res.json(orders.map(toApiOrder));
    } catch (error) {
        console.error("ERROR getOrders:", error);
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les commandes du client connecté
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Non authentifié' });
        const orders = await Order.find({ client: userId })
            .populate('client')
            .populate('products.product')
            .sort({ createdAt: -1 });
        res.json(orders.map(toApiOrder));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une commande par ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('client')
            .populate('products.product');
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
        res.json(toApiOrder(order));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour le statut d'une commande
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const statut = statusToStatut[status] || status;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { statut },
            { new: true, runValidators: true }
        )
            .populate('client')
            .populate('products.product');
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
        res.json(toApiOrder(order));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une commande
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
        res.json({ message: 'Commande supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getOrders, getMyOrders, getOrderById, updateOrderStatus, deleteOrder };
