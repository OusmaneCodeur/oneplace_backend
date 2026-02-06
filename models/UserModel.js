const mongoose = require('mongoose');

// Schema spécifique pour les administrateurs
const adminSchema = new mongoose.Schema({
    adminCode: {
        type: String,
        required: true
        },
    permissions: {
        type: [String],
        default: []
    }
},
    { _id: false }
);

// Schema spécifique pour les modérateurs
const moderatorSchema = new mongoose.Schema({
    moderatedSections: {
        type: [String],
        default: []
    }
},
    { _id: false } 
);

// Schéma principal des utilisateurs
const userSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true
        },
        prenom: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true, 
            unique: true
        },
        motDePasse: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "client", "moderator"],
            default: 'client'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        adminDetails: {
            type: adminSchema,
            required: function () { return this.role === 'admin'; }
        },
        moderatorDetails: {
            type: moderatorSchema,
            required: function () { return this.role === 'moderator'; }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
