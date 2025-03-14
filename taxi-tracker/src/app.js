const express = require('express');
const bodyParser = require('body-parser');
const formRoutes = require('./routes/formRoutes');
const taxiRoutes = require('./routes/taxiRoutes');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/taxis', taxiRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});