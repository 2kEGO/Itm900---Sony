const User = require('../models/userModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const register = async(req, res) => {

    try {
        const {firstName, lastName, userName, email, role, password, projectAccess, message} = req.body;

        const existingUser = await User.findOne({userName})

        if(existingUser){
            return res.status(400).json({msg: 'Username already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({firstName, lastName, userName, email, role, password, projectAccess, message, password: hashedPassword,});

        await newUser.save();
        res.status(200).json({msg: `Username ${userName} created successfully`})


    } catch (error) {
        res.status(400).json({msg: `Internal Server Error`})
    }

};

const login = async (req, res) => {
    try {
        const {userName, password} = req.body;

        const user = await User.findOne({userName});
        
        if(!user){
            return res.status(400).json({msg: 'User not found'})
        }

        const pwdMatch = await bcrypt.compare(password, user.password);

        if(!pwdMatch){
            return res.status(400).json({msg: 'Invalid credentials'})
        }

        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY,{expiresIn: '1h'});

        res.status(200).json({token, projectAccess: user.projectAccess, role: user.role});

    } catch (error) {
        res.status(400).json({msg: "Internal Server Error"})
    }
    

}




module.exports = {register, login};