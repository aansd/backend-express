const { subject } = require('@casl/ability');
const { policyFor } = require('../../utils');
const DeliverAddress = require('./model');

const store =  async(req, res, next) => {
    try {
        let payload = req.body;
        let user = req.user;
        let address = new DeliverAddress({...payload, user: user._id});
        await address.save();
        return res.json(address);
    } catch (err) {
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

const update = async(req, res, next) => {
    try{
        let {_id, ...payload} = req.body;
        let{id} = req.params;
        let address = await DeliverAddress.findById(id);
        let subjectAddress = subject('DeliveryAddress', {...address, user_id: address.user});
        let policy = policyFor(req.user);
        if(!policy.can('update', subjectAddress)) {
            return res.json({
                error: 1,
                message: `you're not allow to modify this resource`
            });
        }
        address = await DeliverAddress.findByIdAndUpdate(id, payload, {new: true});
        return res.json(address);
    }catch(err){
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

const destroy = async(req, res, next) => {
    try{
        let {id} = req.params;
        let address = await DeliverAddress.findById(id);
        let subjectAddress = subject('DeliveryAddress', {...address, user_id: address.user});
        let policy = policyFor(req.user);
        if(!policy.can('delete', subjectAddress)) {
            return res.json({
                error: 1,
                message: `you're not allow to modify this resource`
            });
        }
        address = await DeliverAddress.findByIdAndDelete(id);
        return res.json(address);
    }catch(err){
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
    try{
        let {skip = 0, limit = 10} = req.query;
        let count = await DeliverAddress.find({user: req.user._id}).countDocuments();
        let address = await DeliverAddress
        .find({user: req.user._id})
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort('-createdAt');
        return res.json({data: address, count});
    }catch(err){
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
    store,
    update,
    destroy,
    index
}