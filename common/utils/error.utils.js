const httpError = require("http-errors")
function NotfoundError(req,res,next){
    res.status(404).json({
        statusCode: 404,
        message: "page not found"
    })
}
function ErrorHandler(err,req,res,next){
    const serverError = httpError.InternalServerError()
    const status = err?.status || err?.statusCode || serverError.statusCode
    const message = err?.message || serverError.message
    res.status(status).json({
        errors:{
            status,
            message,
            error: err?.error
        }
    })
}
module.exports = {
    NotfoundError,
    ErrorHandler
}