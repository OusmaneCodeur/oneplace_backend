const express = require('express');
const router = express.Router();

const {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUserRole,
    toggleUserStatus,
    deleteUser
} = require('../controllers/user.controller');

const auth = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

// Routes utilisateur
router.post('/register', register);
router.post('/login', login);

// Routes accessibles par l'admin (ordre: /all, /moderation, /profile avant /:id)
router.get('/all', auth, authorizeRoles('admin'), getAllUsers);
router.get('/moderation', auth, authorizeRoles('admin', 'moderator'), (req, res) => {
    res.json({ message: 'Accès modération' });
});
router.get('/profile', auth, authorizeRoles('admin', 'moderator', 'client'), (req, res) => {
    res.json({ message: 'Profil utilisateur', user: req.user });
});
router.get('/:id', auth, authorizeRoles('admin'), getUserById);
router.put('/:id/role', auth, authorizeRoles('admin'), updateUserRole);
router.put('/:id/toggle-status', auth, authorizeRoles('admin'), toggleUserStatus);
router.delete('/:id', auth, authorizeRoles('admin'), deleteUser);

module.exports = router;
