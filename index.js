require('dotenv').config();
const express = require('express');
const cors = require( 'cors' );
const connectDB = require('./database/connectDB.js');
const RequestLogger = require('./middlewares/logger.js');
const errorhandler = require('./middlewares/errorHandler.js');

const ArticleRoutes = require('./routes/article.route.js');
const UserRoutes = require("./routes/user.route.js");

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json()); // Parse JSON bodies

app.use(cors('*'));

app.use(RequestLogger);

app.use('/api', ArticleRoutes);
app.use("/api/users/" , UserRoutes);
const corsOptions = {
  origin: 'http://localhost:3004',

};

app.use(errorhandler);

app.listen(PORT, () => {
    console.log(`Server Listening on Port ${PORT}`);
});