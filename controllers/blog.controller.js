const createHttpError = require("http-errors")
const { elasticClient } = require("../common/configs/elastic.config")

const BlogIndex = "blog"
// find methods
async function findByTitle(req, res, next) {
    try {
        const { title } = req.query
        const blog = await elasticClient.search({
            index: BlogIndex,
            query: {
                match: {
                    title
                }
            }
        })
        return res.json({
            blog: blog.hits.hits
        })
    } catch (error) {
        next(error)
    }
}
async function findByMultiFiled(req, res, next) {
    try {
        const { search } = req.query
        // act like or in MongoDB
        const blog = await elasticClient.search({
            index: BlogIndex,
            query: {
                multi_match: {
                    query: search,
                    fields: ["title", "text"]
                }
            }
        })
        return res.json({
            blog: blog.hits.hits
        })
    } catch (error) {
        next(error)
    }
}
async function findByRegexp(req, res, next) {
    try {
        const { search } = req.query
        const blog = await elasticClient.search({
            index: BlogIndex,
            query: {
                regexp: {
                    title: `.*${search}.*`
                }
            }
        })
        return res.json({
            blog: blog.hits.hits
        })
    } catch (error) {
        next(error)
    }
}
async function findMultiByRegexp(req, res, next) {
    try {
        const { search } = req.query
        const blog = await elasticClient.search({
            index: BlogIndex,
            query: {
                bool: {
                    should: [
                        {
                            regexp: { title: `.*${search}.*` }
                        },
                        {
                            regexp: { author: `.*${search}.*` }
                        },
                        {
                            regexp: { text: `.*${search}.*` }
                        },
                    ]
                }
            }
        })
        return res.json({
            blog: blog.hits.hits
        })
    } catch (error) {
        next(error)
    }
}
// CRUD methods
async function getBlogs(req, res, next) {
    try {
        const value = req.params.value
        const blogs = await elasticClient.search({
            index: BlogIndex,
            q: value
        })
        return res.json(blogs.hits.hits)
    } catch (error) {
        next(error)
    }
}
async function createBlog(req, res, next) {
    try {
        const { title, author, text } = req.body
        const createResult = await elasticClient.index({
            index: BlogIndex,
            document: {
                title,
                text,
                author
            }
        })
        res.json({
            createResult
        })
    } catch (error) {
        next(error)
    }
}
async function deleteBlog(req, res, next) {
    try {
        const { id } = req.params
        const result = await elasticClient.deleteByQuery({
            index: BlogIndex,
            query: {
                match: {
                    _id: id
                }
            }
        })
        return res.json(result)
    } catch (error) {
        next(error)
    }
}
async function updateBlog(req, res, next) {
    try {
        // this way update all filed its good for CQRS to update all filed with other db values
        const { title, text, author } = req.body
        const { id } = req.params
        const blog = (await elasticClient.search({ index: BlogIndex, query: { match: { _id: id } } })).hits.hits[0]
        if (!blog) throw new createHttpError.NotFound("blog not found with this id")
        const payload = blog._source || {}
        const updateResult = await elasticClient.index({
            index: BlogIndex,
            id,
            body: {
                // @ts-ignore
                ...payload,
                title, text, author
            }
        })
        res.json(updateResult)
    } catch (error) {
        next(error)
    }
}
async function updateBlogUseUpdate(req, res, next) {
    try {
        const { title, text, author } = req.body
        const { id } = req.params
        const updateResult = await elasticClient.update({
            index: BlogIndex,
            id,
            doc: {
                title, text, author
            }
        })
        res.json(updateResult)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getBlogs,
    createBlog,
    findByTitle,
    deleteBlog,
    updateBlog,
    updateBlogUseUpdate,
    findByMultiFiled,
    findMultiByRegexp,
    findByRegexp
}