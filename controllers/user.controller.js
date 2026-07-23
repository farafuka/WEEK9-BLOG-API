const UserModel = require("../models/user.model.js");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res, next) => {
    const registerSchema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.message });
    }
    try {
        const { email, password, name } = value;

        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(password, salt);

        const User = new UserModel({
            email,
            password: hashed,
            name
        });
        
        await User.save();

        return res.status(200).json({ message: "User Registered Successfully" });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });

    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.message });
    }
    try {
        const { email, password } = value;

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          { userId: user._id, name: user.name }, 
          process.env.JWT_SECRET || "fallback_secret",
          { expiresIn: "7d" } 
        );
        const resUser = {
            _id: user._id,
            email: user.email,
            name: user.name,
        };

        const userResponse = user.toObject();

        return res.status(200).json({ message: "logged in", user: resUser, token });
    } catch (error) {
        next(error);
    }
};

module.exports = { loginUser, registerUser };
