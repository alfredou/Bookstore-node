const express = require('express')
const {getComments, sendComment} = require('../Controllers/comment')
const verifyToken = require('../middlewares/verifyToken')
const commentRouter = express.Router()

commentRouter.post("/", verifyToken, sendComment)
commentRouter.get("/:id", getComments)

module.exports = commentRouter