const Product = require('../models/product.model');

// Créer un nouveau produit

const createProduct = async (req, res) => {
    try {
        const { name, price, stock, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image obligatoire" });
        }

        const product = await Product.create({
            name,
            price,
            stock,
            description,
            image: `/uploads/${req.file.filename}`,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


//Modifier un produit existant
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer tous les produits
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un produit par ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
        res.json(product);
    } catch (error) {
        res.status(404).json({ message: 'Produit non trouvé' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Supprimer le produit
        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: "Produit supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
