const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const asyncHandler = require('express-async-handler')
const User = require("../models/userModel")

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const {email, password } = req.body


    if ( !email || !password) {
        res.status(400)
        throw new Error("please fill all details")
    }
    // Check if User Exists
    const userExist = await User.findOne({ email: email })
    if (userExist) {
        res.status(401)
        throw new Error("User already exists")
    }
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({
   
        email,
        password: hashedpassword

    })
    if (user) {
        res.status(200).json({
            id: user._id,
            // name: user.name,
            email: user.email,
            password: user.password,
            token: generateToken(user._id)

        })
    }

})
// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // check fields
    if (!email || !password) {
        res.status(400)
        throw new Error("Fill all details")
    }
    // check userexist 
    const user = await User.findOne({ email: email })
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            id: user._id,
            // name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid")
    }

})


const generateToken = (id) => {
    return (jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    }))
}
module.exports = {
    registerUser,
    loginUser
}