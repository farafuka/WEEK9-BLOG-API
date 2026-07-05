require('dotenv').config();
const express = require('express');
const cors = require( 'cors' );
const connectDB = require('./database/connectDB.js');
const RequestLogger = require('./middlewares/logger.js');
const errorhandler = require('./middlewares/errorHandler.js');
const validateTodo = require('./middlewares/validator.js');
const validateTodoPatch = require('./middlewares/validateTodoPatch.js');

const ArticleRoutes = require('./routes/article.route.js');

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json()); // Parse JSON bodies

app.use(cors('*'));

app.use(RequestLogger);

app.use('/api', ArticleRoutes);

const corsOptions = {
  origin: 'http://localhost:3004',
  // some legacy browssrs (IE11, Various SmartTVs)
};

app.use(errorhandler);

app.listen(PORT, () => {
    console.log(`Server Listening on Port ${PORT}`);
});