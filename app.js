const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/config/db');
const eventRoutes = require('./backend/routes/eventRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
