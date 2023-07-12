const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const path = require('path');

const bookRoutes = require('./routes/Book');
const userRoutes = require('./routes/User');

dotenv.config();
const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.7buig2u.mongodb.net/?retryWrites=true&w=majority`;
  
async function connect() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connexion à MongoDB réussie !');
  } catch (e) {
    console.error('Connexion à MongoDB échouée !');
    console.error(e);
  }
}
connect();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(mongoSanitize());
app.use(helmet());

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;