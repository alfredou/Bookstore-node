const express = require('express')
const { updateUser } = require('../Controllers/user')
const { getOrder, getOrders } = require('../Controllers/order')

const userRouter = express.Router()

userRouter.get("/order/:id", getOrders)
userRouter.get("/:id", getOrder)
userRouter.patch("/updateUser/:id", updateUser)

module.exports = userRouter