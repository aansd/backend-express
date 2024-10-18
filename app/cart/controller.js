const Product = require('../product/model');
const cartItem = require('../cart-item/model');
const { json } = require('express');

const update = async(req, res, next) => {
    try{
        // console.log('Payload diterima:', JSON.stringify(req.body, null, 2));
        const {item} = req.body;

        const productIds = item.map(item => item.product._id);
        const products = await Product.find({_id: {$in: productIds}});
        let cartItems = item.map(item => {
            let relatedProduct = products.find(product => product._id.toString() === item.product._id);
            return {
                product: relatedProduct._id,
                price: relatedProduct.price,
                image_url: relatedProduct.image_url,
                name: relatedProduct.name,
                user: req.user._id,
                qty: item.qty
            }
        });

        await cartItem.deleteMany({user: req.user._id});
        await cartItem.bulkWrite(cartItems.map(item => {
            return {
                updateOne: {
                    filter: {
                        user: req.user._id,
                        product: item.product
                    },
                    update: item,
                    upsert: true
                }
            }
        }));
        return res.json(cartItems);
    } catch (err){
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}


const index = async (req, res, next) => {
    try {
        let items = await cartItem.find({user: req.user._id}).populate('product');
        return res.json(items);
    } catch (err) {
        console.error("Error in fetching cart items:", err); // Log error detail
        if(err && err.name === 'ValidationError'){
            return res.status(400).json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

module.exports = {
    update,
    index
}