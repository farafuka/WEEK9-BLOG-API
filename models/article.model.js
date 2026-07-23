const { ref, required } = require("joi");
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
    title : {
        type : String,
        required : true,
        minlength : 5 
    },
    content : {
        type : String,
        required : true,
        minlength : 20 
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },
}, 
    {timestamps : true}
);

// Create a text index
articleSchema.index({
  title: "text",
  content: "text",
});

const Article = mongoose.model('Article', articleSchema);

module.exports = mongoose.model("Article", articleSchema);