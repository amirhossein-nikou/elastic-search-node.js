const { Router } = require("express");
const { createBlog, getBlogs, deleteBlog, updateBlog, updateBlogUseUpdate, findByTitle, findByMultiFiled, findByRegexp, findMultiByRegexp } = require("../controllers/blog.controller");

const router = Router()
router.post("/create", createBlog)
router.get("/list/:value?", getBlogs)
router.delete("/remove/:id", deleteBlog)
router.put("/update/:id", updateBlog)
router.put("/updateMethod/:id", updateBlogUseUpdate)
// find methods in elastic search
router.get("/findByTitle", findByTitle)
router.get("/findMulti", findByMultiFiled)
router.get("/findMultiRegexp", findMultiByRegexp)
router.get("/findRegexp", findByRegexp)

module.exports = {
    BlogRoutes: router
}