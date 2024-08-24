const User = require("../model/User");
const bcrypt = require("bcryptjs");

// get all users

const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (error) {
        console.log(error);
    }
    if (!users) {
        return res.status(404).json({ message: "No Users Found " });
    }
    return res.status(200).json({ users });
};

// signup(register) user

const signupUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return console.log(err);
    }
    if (existingUser) {
        return res.status(400).json({ message: "User already exist!Login Instead" });
    }
    const hashPassword = bcrypt.hashSync(password);

    const user = new User({
        name,
        email,
        password: hashPassword,
        blogs:[]
    });
    try {
        await user.save();
    } catch (err) {
        return console.log(err);
    }
    return res.status(201).json({ user });
};


// login user 

const loginUser=async(req,res,next)=>{
    const {email,password}=req.body 
    let existingUser 
    try {
        existingUser=await User.findOne({email})
        
    } catch (error) {
        return console.log(error)
        
    }
    if(!existingUser){
        return res.status(404).json({message:"Couldn't find user by this Email"})
    }
    const isPasswordCorrect=bcrypt.compareSync(password,existingUser.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Incorrect password"})
    }
    return res.status(200).json({message:"Login Successful",user:existingUser})

}

exports.getAllUsers = getAllUsers;
exports.signupUser = signupUser;
exports.loginUser=loginUser
