const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn:"7d"
    });
};

const registerUser = async (req, res) =>{
    try{
        const {name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                message: "Name , email and password are required"
            });
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 character"});
        }

        const exitstingUser = await User.findOne({ email }) ;

        if (exitstingUser){
            return res.status(400).json({
                message: "user already exists with this email"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user= await User.create({
            name,
            email, 
            password: hashedPassword
        });

        res.status(201).json({
            message: "user registerd successfully",
            token: generateToken(user._id),
            user:{
                id: user._id,
                name:user.name,
                email: user.email
            }
        });
    }catch (error) {
        res.status(500).json({
            message: "server error",
            error: error.message
        });
    }
};

const loginUser = async (req, res)=>{
    try{
        const { email,password} =req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if(!user) {
             return res.status(401).json({
                message: "Invaild email or password"
             })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({
                message: "invalid email or password"
            })
        }

        res.status(200).json({
            message: "Login successful",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });


    }catch(error){
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }


};

const getMe= async (req,res) =>{
    res.status(200).json({
        user: req.user
    })
};

module.exports = {
    registerUser,
    loginUser,
    getMe
}