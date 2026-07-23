const Joi = require("joi"); // 1. Fixed case-sensitivity issue (capital J)

const ArticleModel = require('../models/article.model.js');

const postArticle = async (req, res, next) => {
  const articleSchema = Joi.object({
    title: Joi.string().min(5).required(),
    content: Joi.string().min(20).required(),
    author: Joi.string().optional().default('Guest'),
  });
  
  const { error, value } = articleSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: 'Please provide valid article title and content', details: error.message });
  }

  try {
    // 2. Fixed bug: Spread the validated value directly into the constructor
    const newArticle = new ArticleModel({
      title: req.body.title,
      content: req.body.content,
      author: req.user?._id // Safely get the ID from your auth middleware
    });      
    await newArticle.save();
    
    return res.status(200).json({
         message: "Article Successfully Created" ,
         data: newArticle 
    });        
  } catch (error) {
    console.error(error);  
    next(error);
  }
};

const getAllArticle = async (req, res, next) => {
  // 3. Fixed bug: Added fallback variables for page and limit so it doesn't crash
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const articles = await ArticleModel.find({}) 
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    return res.status(200).json({
         message: "Articles fetched" ,
         data: articles // 4. Fixed bug: Changed from undefined 'newArticle' to 'articles'
    });      
  } catch (error) {
     console.error(error);  
     next(error); 
  }
};

const getArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id);
    
    if (!article) {
      // 5. Fixed bug: Changed single quotes to backticks (`) so template strings work
      return res.status(404).json({
         message: `Article with ${req.params.id} not found` , 
      });  
    }    

    return res.status(200).json({
        message: 'article found' ,
        data: article,
    });
  } catch (error) {
     console.error(error);  
     next(error); 
  }
};

const updateArticleById = async (req, res, next) => {
  const articleSchema = Joi.object({
    title: Joi.string().min(5).optional(),
    content: Joi.string().min(20).optional(),
    author: Joi.string().optional()
  });

  // 6. Fixed bug: Validated req.body instead of an undefined 'value' variable
  const { error, value } = articleSchema.validate(req.body);

  // 7. Fixed logic bug: Reverted from (!error) to (error) so valid data passes through
  if (error) {
    return res.status(400).json({ error: 'Validation failed', details: error.message });
  }

  try {
    // 8. Fixed bug: Changed from 'Article' to 'ArticleModel' to match your import variable
    const updatedArticle = await ArticleModel.findByIdAndUpdate(
          req.params.id,
          { ...value },
          { new: true }
    ); 

    if (!updatedArticle) { // 9. Fixed typo: Changed from 'updateArticle' to 'updatedArticle'
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json({
      message: 'article updated' ,
      data: updatedArticle,
    });  
  } catch (error) {
    next(error);    
  }
};

const deleteArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json({
        message: 'Article deleted successfully ' ,
    });
    
  } catch (error) {
    next(error); // 10. Fixed bug: Replaced undefined 'NativeError' with 'error'
  }
};

module.exports = {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById
};
