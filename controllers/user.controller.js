const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Enregistrer un nouvel utilisateur
const register = async (req, res) => {
    try {
        const { nom, prenom, email, phoneNumber, motDePasse, role, adminDetails, moderatorDetails } = req.body;

        // Vérifier si utilisateur existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà existant' });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // Construction des données utilisateur
        const userData = {
            nom,
            prenom,
            email,
            phoneNumber,
            motDePasse: hashedPassword,
            role
        };

        // Gestion des rôles
        if (role === 'admin') {
            if (!adminDetails) {
                return res.status(400).json({ message: 'adminDetails requis pour un admin' });
            }
            userData.adminDetails = adminDetails;
        }

        if (role === 'moderator') {
            if (!moderatorDetails) {
                return res.status(400).json({ message: 'moderatorDetails requis pour un modérateur' });
            }
            userData.moderatorDetails = moderatorDetails;
        }

        // Création de l'utilisateur
        const user = await User.create(userData);

        // Réponse sans mot de passe
        const { motDePasse: pwd, ...userResponse } = user._doc;
        res.status(201).json(userResponse);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // Vérifier si utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier mot de passe
        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Génération JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Réponse sans mot de passe
        const { motDePasse: pwd, ...userData } = user._doc;
        res.json({ token, user: userData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer tous les utilisateurs (admin seulement)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-motDePasse');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un utilisateur par ID (admin seulement)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-motDePasse');
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour le rôle (admin seulement)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'moderator', 'client'].includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-motDePasse');
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bloquer / Débloquer (admin seulement)
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-motDePasse');
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        user.isActive = user.isActive === false;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un utilisateur (admin seulement)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getAllUsers, getUserById, updateUserRole, toggleUserStatus, deleteUser };
