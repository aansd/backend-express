const router = require('express').Router();
const { police_check } = require('../../middlewares');
const oerderController = require('./controller');

router.post('/orders', police_check('create', 'Order'), oerderController.store);
router.get('/orders', police_check('view', 'Order'), oerderController.index);

module.exports = router;