const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const connectDB = require('./backend/config/db');
const eventRoutes = require('./backend/routes/eventRoutes');
const path = require("path");
const app = express();
app.set('views', path.join(__dirname, '/backend/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);
app.get('/',(req,res)=>
{
    res.render('dashboard');

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
