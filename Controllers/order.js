const Order = require('../Models/Order')
const createError = require('../utils/error')


const getOrder = async (req, res, next)=>{
  const id = req.params.id
    try{
              const order = await Order.find({userId: id})
              if(!order) res.status(400).send("The order doesn't exist")

              const orders = order.map((item, index)=>{
                const result = {
                    _id: item._id, 
                    userId: item.userId, 
                    total: item.total, 
                    payment_status:item.payment_status, 
                    createdAt: item.createdAt
                }
                return result
              })
              
              res.status(200).send(orders)
    }
    catch(e){
       res.json({error: e.name})
    }
}

const getOrders = async (req, res, next)=>{
    const id = req.params.id
      try{
           const orders = await Order.findById(id)
           if(!orders) res.status(400).send("The order doesn't exist")

           res.status(200).send(orders)
      }
      catch(e){
            res.status(400).json({error: e.name})
      }
}

module.exports = {getOrder, getOrders}