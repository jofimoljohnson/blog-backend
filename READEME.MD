1)install nodemon,express,mongoose
2)app.js
-----------

const express=require('express')
const app=express()

3)Mongo db connection:password: q49TE9T3Cv1RsuxB
-------------------------------------------------
import mongoose from 'mongoose'
mongoose
    .connect(
        "mongodb+srv://admin:q49TE9T3Cv1RsuxB@cluster0.ovcwk0i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => app.listen(5000))
    .then(() => console.log("Connected to Database and listening to localhost 5000 "))
    .catch((err) => console.log(err));

4)create the folders routes,controller,model
----------------------------------------------
model/User.js
--------------
const mongoose=require('mongoose')

const Schema=mongoose.Schema 

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }

})
module.exports=mongoose.model("User",userSchema)

// User will be a singular form but mongodb will store small letters users and plural form

5)controller/user-controller.js
--------------------------------
const User=require('../model/User')
// get all users

 const getAllUsers=async(req,res,next)=>{
    let users;
    try {
        users =await User.find() 
        
    } catch (error) {
        console.log(error)
      }
      if(!users){
        return res.status(404).json({message:"No Users Found "})
      }
      return res.status(200).json({users})



}

exports.getAllUsers=getAllUsers

6)routes/user-routes.js
------------------------
const express = require("express");

const router = express.Router();
const userController = require("../controller/user-controller");

router.get("/", userController.getAllUsers);
router.post("/signup",userController.signupUser)
router.post("/login",userController.loginUser)



module.exports = router;

8)app.js
---------
// middleware
app.use(express.json()) //this step will help what type of data we are send

app.use("/api/user", router);

7)controller/user-controller.js
--------------------------------
// signup(register) user
--------------------------
to secure the password to install bcryptjjs
---------------------------------------------
// signup(register) user
const bcrypt = require("bcryptjs");


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
    });
    try {
        await user.save();
    } catch (err) {
        return console.log(err);
    }
    return res.status(201).json({ user });
};

exports.signupUser = signupUser;


8)controller/user-controller.js
--------------------------------
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
    return res.status(200).json({message:"Login Successful"})

}

exports.loginUser=loginUser

9)model/Blog.js
----------------
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },

});

module.exports=mongoose.model("Blog",blogSchema)

10)routes/blog-routes.js
-------------------------
const express=require('express')

const router=express.Router()
const blogController=require('../controller/blog-controller')


router.get("/",blogController.getAllBlogs)

11)app.js
----------
const blogRouter = require("./routes/blog-routes");
app.use("/api/blog",blogRouter)

12)routes/blog-routes.js
-------------------------
const express=require('express')

const blogRouter=express.Router()
const blogController=require('../controller/blog-controller')


blogRouter.get("/",blogController.getAllBlogs)
blogRouter.post("/add",blogController.addBlog)
blogRouter.put("/update/:id",blogController.updateBlog)

blogRouter.get("/:id",blogController.getSingleBlog)
blogRouter.delete("/:id",blogController.deleteBlog)




module.exports = blogRouter;


13)controller/blog-controller.js
--------------------------------
const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (err) {
        return console.log(err);
    }
    if (!blogs) {
        return res.status(404).json({ message: "No blogs Found" });
    }
    return res.status(200).json({ blogs });
};
exports.getAllBlogs = getAllBlogs;


14)controller/blog-controller.js
---------------------------------
<!-- add blog -->
const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;
    const blog = new Blog({
        title,
        description,
        image,
        user,
    });
    try {
        await blog.save()
        
    } catch (err) {
        return console.log(err)
        
    }
    return res.status(200).json({blog})
};

exports.addBlog = addBlog;


15)controller/blog-controller.js
-------------------------------------
update blogs
-------------
const updateBlog=async(req,res,next)=>{
    // update only title and description 
    const {title,description}=req.body
    const blogId=req.params.id 
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId,{
            title,
            description
        })
    
        
    } catch (err) {
        return console.log(err)
      }
      if(!blog){
        return res.status(500).json({message:"Unable to update the blog"})
      }
return res.status(200).json({blog})
    
}

16)controller/blog-controller.js
-------------------------------------
// get get single blog
const getSingleBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findById(id);
    } catch (err) {
        return console.log(err);
    }
    if (!blog) {
        return res.status(404).json({ message: "No blog found" });
    }
    return res.status(200).json({ blog });
};

exports.getSingleBlog = getSingleBlog;



15)controller/blog-controller.js
----------------------------------
// delete blog

const deleteBlog=async(req,res,next)=>{
    const id=req.params.id 
    let blog;
    try {
        blog=await Blog.findByIdAndDelete(id)
        
    } catch (err) {
        return console.log(err)
    }
    if(!blog){
        return res.status(500).json({message:"Unable to delete"})
    }
    return res.status(200).json({message:"Successfully deleted"})

}

exports.deleteBlog=deleteBlog


16)model/Blog.js
-----------------
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    <!-- additional step -->
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },

});

module.exports=mongoose.model("Blog",blogSchema)

17)model/User.js
-----------------
const mongoose=require('mongoose')
const Schema=mongoose.Schema 

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    <!-- additional step -->
    blogs:[{type:mongoose.Types.ObjectId,ref:"Blog",required:true}]

})
module.exports=mongoose.model("User",userSchema)
// User will be a singular form but mongodb will store small letters users and plural form


18)controllers/user-controller.js
-----------------------------------
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
        <!-- additional step added -->
        blogs:[]
    });
    try {
        await user.save();
    } catch (err) {
        return console.log(err);
    }
    return res.status(201).json({ user });
};





18)controllers/blog-controller.js
-----------------------------------
const User = require("../model/User");

// add blogs
const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;
    let existingUser;
    try {
        existingUser=await User.findById(user)
        
    } catch (err) {
        return console.log(err)
        
    }
    if(!existingUser){
        return res.status(400).json({message:"Unable to find user by this Id"})
    }
    const blog = new Blog({
        title,
        description,
        image,
        user,
    });
    try {
        const session=await mongoose.startSession()
        session.startTransaction()
        await blog.save({session})
        existingUser.blogs.push(blog)
        await existingUser.save({session})
        await session.commitTransaction()
    } catch (err) {
        console.log(err);
        return res.status(500).json({message:err})
    }
    return res.status(200).json({ blog });
};

19)controllers/blog-controller.js
-----------------------------------
const deleteBlog=async(req,res,next)=>{
    const id=req.params.id 
    let blog;
    try {
        <!-- additional step -->
        blog=await Blog.findByIdAndDelete(id).populate('user')
        await blog.user.blogs.pull(blog)
        await blog.user.save()
        
    } catch (err) {
        return console.log(err)
    }
    if(!blog){
        return res.status(500).json({message:"Unable to delete"})
    }
    return res.status(200).json({message:"Successfully deleted"})

}


20)controllers/blog-controller.js
-----------------------------------
const getByUserId=async(req,res,next)=>{
    const userId=req.params.id 
    let userBlogs;
    try {
        userBlogs=await User.findById(userId).populate("blog")
        
    } catch (err) {
        return console.log(err)
        
    }
    if(!userBlogs){
        return res.status(404).json({message:"No blog found"})
    }
    return res.status(200).json({blogs:userBlogs})

}

exports.getByUserId=getByUserId


21)