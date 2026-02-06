const mongoose = require('mongoose');

// Fonction de connexion à la base de données MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log('✅ Connexion à la base de données MongoDB réussie');
    } catch (error) {
        console.error('❌ Connexion à la base de données MongoDB échouée', error);
        process.exit(1); 
    } 
};

module.exports = connectDB;