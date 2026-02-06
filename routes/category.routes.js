const express = require("express");
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/category.controller");

const auth = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const router = express.Router();

// ➕ Créer une catégorie
router.post(
    "/new-category",
    auth,
    authorizeRoles("admin", "moderator"),
    createCategory
);

// 📄 Voir toutes les catégories (admin)
router.get("/", auth, authorizeRoles("admin"), getCategories);

// 📄 Voir une catégorie
router.get("/:id", auth, authorizeRoles("admin"), getCategoryById);

// ✏️ Modifier
router.put("/:id", auth, authorizeRoles("admin"), updateCategory);

// 🗑️ Supprimer
router.delete("/:id", auth, authorizeRoles("admin"), deleteCategory);

module.exports = router;
