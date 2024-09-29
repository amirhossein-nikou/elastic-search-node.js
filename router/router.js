const { Router } = require("express");
const { IndicesRoutes } = require("./indices.routes");
const { BlogRoutes } = require("./blog.routes");

const router = Router()
router.use("/indices",IndicesRoutes)
router.use("/blog",BlogRoutes)
module.exports = {
    AllRoutes: router
}