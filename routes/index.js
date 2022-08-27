// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

const router = require('koa-router')();
const upload = require('../common/uploadConfig'); // 引入我们的中间键

router.get('/test', async ctx => {
	console.log(ctx.query);
	ctx.body = ctx.query;
});
router.post('/uploadloading', upload.single('file'), async ctx => {
	// console.log('new data', ctx.req.file);

	ctx.body = { code: 200, result: '请求成功' };
});

module.exports = router;
