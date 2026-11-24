import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import beneficiaryRoutes from './routes/beneficiaryRoutes.js';
import distributionRoutes from './routes/distributionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import mongoose from 'mongoose';

dotenv.config();

let isConnected = false
async function connectDb() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        isConnected = true
        console.log("Connected to MongoDB")
    }catch(error){
        console.error("Error connecting to MongoDB:", error)
    }
    
}

app.use((req,res,next)=>{
    if(!isConnected){
        connectDB()
    }
    next()
})

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => res.json({ status: 'API running' }));

app.use(notFound);
app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
module.exports = app
