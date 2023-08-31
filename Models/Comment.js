const mongoose = require("mongoose");
const { Schema, model } = require('mongoose')

const UserComments = new Schema({
       bookisbn: {
         type: String
       },
       rating: {
          type: Number,
          default: 0
       },
       comment: {
          type: String,
          default: ''
       },
       user: {
         type: Schema.Types.ObjectId,
         ref: 'User'
       }
},
    { timestamps: true }
)

const Comment = model("Comment", UserComments)

module.exports = {Comment}