const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const createError = require('../utils/error')

const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })

        await newUser.save()
        res.status(200).send("User has been created")

    } catch (e) {
        next(e)
    }
}
const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) return next(createError(404, "User not found"))

        const passwordIsCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!passwordIsCorrect) return next(createError(400, "Wrong password or username"))

        const token = jwt.sign({ id: user._id }, process.env.JWT)

        const { password, ...otherdetails } = user._doc

        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: "None"
        }).status(200).json({ ...otherdetails })

    } catch (e) {
        next(e)
    }
}


module.exports = { register, login}