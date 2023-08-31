const { Comment } = require('../Models/Comment')
const User = require('../Models/User')

const getComments = async (req, res, next) => {
    const id = req.params.id
    
    try {
        const comments = await Comment.find({bookisbn: id}).populate('user', {
            username: 1,
        })
        if(!comments || comments.length === 0) return res.status(204).send("User doesn't have comments")

          let totalSum = 0
          comments.forEach((item, index)=>{
                totalSum = totalSum + item.rating
          })
          
             let productRating = (totalSum / comments.length)
                   
          res.status(200).json({comments, productRating})
    }catch(e){
        //console.log(e)
        res.status(400).json({error: e.name})
    }
}

const sendComment = async (req, res, next) => {
       const {bookisbn, rating, comment, userId} = req.body
    try {
         const user = await User.findById(userId)
           
         const userComment = new Comment({
               bookisbn,
               rating,
               comment,
               user: user._id
           })

        const savedComment = await userComment.save()
        user.comments = user.comments.concat(savedComment._id)
        await user.save();
        res.status(200).send("Comment saved sucessfully")

        } catch(e){
           res.status(400).json({error: e.name})
       }
}

module.exports = {getComments, sendComment}