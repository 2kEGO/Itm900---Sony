const express = require('express');
const connectDb =require('./backend/config/connectDb.js')
const authRoutes = require('./backend/routes/authRoutes.js')
const dotenv = require('dotenv')
const userRoutes = require('./backend/routes/userRoutes.js')
const cors = require('cors')

// Connect to database
dotenv.config();
connectDb();
const app = express();

// Middleware 
app.use(cors())
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


//Start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});