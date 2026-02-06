const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) { // Vérifie si l'utilisateur est authentifié
            return res.status(401).json({ 
                message: 'Utilisateur non authentifié'
            });
        }

        if (!allowedRoles.includes(req.user.role)) { // Vérifie si le rôle de l'utilisateur est autorisé
            return res.status(403).json({
                message: 'Accès refusé : permissions insuffisantes'
            });
        }

        next(); 
    };
};

module.exports = authorizeRoles;
