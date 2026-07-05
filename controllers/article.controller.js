const Joi = require ("joi");

const ArticleModel = require("../models/article.model.js");

const postArticle = async (req, res, next) => {
  const articleSchema = Joi.object({
    title: Joi.string().min(5).required(),
    content: Joi.string().min(20).required(),
    author: Joi.string().optional().default("Guest"),
  });
  
  const { error, value} = articleSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  try {
    const { title, content, author } = value;
    const newArticle = new ArticleModel({
      title,
      content,
      author: author || 'Guest',
    });
    await newArticle.save();

    return res.status(200).json({
        message: "Article created" ,
        data: newArticle
    })
  } catch (error) {
      
      console.error(error)  
      next(error);
    }
};

const getAllArticle = async (req, res, next) => {
    const { limit = 10, page = 1 } = req.query;

    const skip = (page - 1) * limit;
    try {
      const article = await ArticleModel.find({})
          .sort({ createdAt: 1})
          .limit(limit)
          .skip(skip);
        
        return res.status(200).json({
            message: "Articles fetched",
        })
  } catch (error) {
      
      console.error(error)  
      next(error);
    }
};

const getArticleById = async (req, res, next) => {
    try {
      const article = await ArticleModel.findById(req.params.id);

    if (!article) {
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
    next: (error);
  }
};


const updateArticleById = async (req, res, next) => {

     const articleSchema = Joi.object({
       title: Joi.string().min(5).optional(),
       content: Joi.string().min(20).optional(),
       author: Joi.string().optional()
     }); 

    const { error, value } = articleSchema.validate(req.body);

     if (error) {
       return res.status(400).json('Please provide article title and content');
    }
  try {
    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
         new: true,
         runValidators: true,
      }
    );        
    if(!updatedArticle){
        return res.status(404).json({
            message: "article not found",
        });
    }

    return res.status(200).json({
      message: "article updated",
      data: updatedArticle,
    });  
    } catch (error) {
        next(NativeError)
    }
};


const deleteArticleById = async (req, res, next) => {
    try {
      const article = await ArticleModel.findByIdAndDelete(req.params.id);
      
      if (!article) {
        return res.status(200).json({
            message: 'Article not found',
        });
      }     
      
      res.status(200).json({
        message: "article deleted",
      });
    } catch (error) {
        next(NativeError);
    }
};

const searchArticle = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search keyword (q) is required",
      });
    }

    const article = await ArticleModel.find({
      $text: { $search: q },
    });

    res.status(200).json({
      message: "Search completed",
      count: article.length,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById,
    searchArticle,

};