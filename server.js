const express = require('express');
const connectDb = require('./backend/config/connectDb.js');
const authRoutes = require('./backend/routes/authRoutes.js');
const dotenv = require('dotenv');
const userRoutes = require('./backend/routes/userRoutes.js');
const cors = require('cors');
const uploadRoutes = require('./backend/routes/awsRoutes.js');

// Initialize app first
const app = express();

// Middleware 
app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Load environment variables
dotenv.config();

// Connect to database
connectDb();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
