const express = require('express')
const app = express();
require('dotenv').config()
const { PORT } = process.env
const http = require('http');
const { ErrorHandler, NotfoundError } = require('./common/utils/error.utils');
const { AllRoutes } = require('./router/router');
const server = http.createServer(app)
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(AllRoutes)
app.use(NotfoundError)
app.use(ErrorHandler)
server.listen(PORT, () => {
    console.log(`server run ==> http://localhost:${PORT}`);
})