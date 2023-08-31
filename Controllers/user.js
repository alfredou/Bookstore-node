const User = require('../Models/User')
const bcrypt = require('bcrypt')
const createError = require('../utils/error')
const cloudinary = require('cloudinary');
require('../coudinary')

const updateUser = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const user = await User.findById(id);
        if (!user) return next(createError(404, "User not found"));

        let updateUser = {};

        if (req.body.img?.length > 0) {
            const result = await cloudinary.uploader.upload(req.body.img[0]);
            updateUser.image = result.secure_url;
        }

        if (req.body.password !== '' && req.body.password !== null && req.body.password !== undefined) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            updateUser.password = hash;
        }

        updateUser.username = req.body.username;
        updateUser.email = req.body.email;

        const updatedUser = await User.findByIdAndUpdate(id, updateUser, {new: true});
        
        res.status(200).json(updatedUser);
    } catch (e) {
        res.status(400).json({ error: e.name });
        console.log(e);
    }
};

module.exports = { updateUser };
    
