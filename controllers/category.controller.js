const Category = require("../models/CategoryModel");

// ➕ Créer une nouvelle catégorie
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = await Category.create({
            name,
            description,
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 📄 Récupérer toutes les catégories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📄 Récupérer une catégorie par ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Catégorie introuvable" });
        }

        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✏️ Modifier une catégorie
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Catégorie introuvable" });
        }

        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🗑️ Supprimer une catégorie
const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Catégorie supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
