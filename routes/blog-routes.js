const express=require('express')

const blogRouter=express.Router()
const blogController=require('../controller/blog-controller')


blogRouter.get("/",blogController.getAllBlogs)
blogRouter.post("/add",blogController.addBlog)
blogRouter.put("/update/:id",blogController.updateBlog)
blogRouter.get("/:id",blogController.getSingleBlog)
blogRouter.delete("/:id",blogController.deleteBlog)
blogRouter.get("/user/:id",blogController.getByUserId)

module.exports = blogRouter;
