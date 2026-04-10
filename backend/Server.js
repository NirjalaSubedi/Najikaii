const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes=require('./routes/authroutes');
const orderRoutes=require('./routes/orderroutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Najikai Database Connected Successfully!");
    } catch (err) {
        console.error("Connection Failed:", err.message);
        process.exit(1); 
    }
};

connectDB();

app.get('/', (req, res) => {
    res.send("Najikai API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
app.use('/api/auth', authRoutes);
app.use('/api/order',orderRoutes);