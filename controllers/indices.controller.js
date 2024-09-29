const createHttpError = require("http-errors")
const { elasticClient } = require("../common/configs/elastic.config")

async function createIndex(req, res, next) {
    try {
        const { indexName } = req.body
        if (!indexName) throw new createHttpError.NotFound("index name value not found")
        const result = await elasticClient.indices.create({ index: indexName })
        res.json({
            message: "index created successFully"
        })
    } catch (error) {
        next(error)
    }
}
async function getIndices(req, res, next) {
    try {
        const indices = await elasticClient.indices.getAlias()
        const regexp = /^\.+/
        return res.json({
            indices: Object.keys(indices).filter(item => !regexp.test(item))
        })
    } catch (error) {
        next(error)
    }
}
async function removeIndex(req, res, next) {
    try {
        const { indexName } = req.query
        const result = await elasticClient.indices.delete({ index: indexName })
        return res.json({
            message: "index remove successfully"
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    createIndex,
    getIndices,
    removeIndex
}