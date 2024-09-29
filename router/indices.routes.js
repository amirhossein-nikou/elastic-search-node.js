const { Router } = require("express");
const { createIndex, getIndices,removeIndex } = require("../controllers/indices.controller");

const router = Router()
router.post("/create", createIndex)
router.get("/list", getIndices)
router.delete("/remove:indexName", removeIndex)
module.exports = {
    IndicesRoutes: router
}