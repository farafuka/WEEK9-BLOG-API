const express = require('express');

const {
  postArticle,
  getAllArticle,
  getArticleById,
  updateArticleById,
  deleteArticleById,
} = require('../controllers/article.controller.js');

const requireAuth = require('../middlewares/requireAuth.js'); 

const router = express.Router();

router.post('/articles' , requireAuth, postArticle);

router.get('/articles' , requireAuth, getAllArticle);

router.get('/articles/:id' , requireAuth, getArticleById);

router.put('/articles/:id' , requireAuth, updateArticleById);

router.delete('/articles/:id' , requireAuth, deleteArticleById);

module.exports = router;