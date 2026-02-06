const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');



dotenv.config();
connectDB();

const app = express();

const fs = require("fs"); 
const path = require("path");

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}


// Middlewares
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));



// Importation des routes
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const categoryRoutes = require('./routes/category.routes');
const reviewRoutes = require('./routes/review.routes');
const deliveryRoutes = require('./routes/delivery.routes');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/deliveries', deliveryRoutes);

app.get('/', (req, res) => {
    res.send("ONEPLACE – Tout en un seul endroit");
});



module.exports = app; 
