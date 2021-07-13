const mongoose = require('../../common/database')();
const Schema = mongoose.Schema;
const cartSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    bag: [{
        quantity: {
            type: Number,
        },
        prd_id: {
            type: mongoose.Types.ObjectId,
            ref: "products"
        }
    }] 
}, {
    timestamps: true
})

const CartModel = mongoose.model("carts", cartSchema, "carts")
module.exports = CartModel