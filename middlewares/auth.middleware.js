const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Vérifier la présence du header Authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Accès refusé. Token manquant.'
            });
        }

        // Extraire le token
        const token = authHeader.split(' ')[1];

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Récupérer l'utilisateur
        const user = await User.findById(decoded.id).select('-motDePasse');

        if (!user) {
            return res.status(401).json({
                message: 'Utilisateur non trouvé.'
            });
        }

        // Attacher les infos utilisateur
        req.user = {
            id: user._id,
            role: user.role,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Token invalide ou expiré.'
        });
    }
};

module.exports = authUser;
