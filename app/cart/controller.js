const Product = require('../product/model');
const cartItem = require('../cart-item/model');
const { json } = require('express');

const update = async(req, res, next) => {
    try{
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


const index = async(req, res, next) => {
    try {
        let items = await find({user: req.user._id}).populate('product');
        return res.json(items);
    } catch (error) {
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

module.exports = {
    update,
    index
}