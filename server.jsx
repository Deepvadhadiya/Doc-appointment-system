const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db.jsx');
const path = require('path');

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/user', require('./routes/userRoutes.jsx'));
app.use('/api/v1/admin', require('./routes/adminRoutes.jsx'));
app.use('/api/v1/doctor', require('./routes/doctorRoutes.jsx'));

//port
const port = process.env.PORT || 8080

//listen port
app.listen(port, () => {
    console.log(`Server Running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`.bgCyan.white)
});