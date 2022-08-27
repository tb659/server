const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();

router.use(multer({ dest: './public/images' }).any());

router.get('/api/user1', (req, res) => {
	console.log('req.query-------', req.query);
	setTimeout(() => {
		res.send({ code: '0', data: { method: 'get方法', list: [{ a: 12, b: 241112 }] } });
	}, 1000);
});
router.post('/user2', (req, res) => {
	console.log(req.body);
	setTimeout(() => {
		res.send({ code: '0', data: { method: 'post方法', list: [{ a: 12, b: 24 }] } });
	}, 2000);
});
router.put('/user3', (req, res) => {
	console.log(req.body);
	res.send({ code: '0', data: { method: 'put方法', list: [{ a: 12, b: 24 }] } });
});
router.delete('/user4', (req, res) => {
	console.log(req.query);
	res.send({ code: '0', data: { method: 'delete方法', list: [{ a: 12, b: 24 }] } });
});

// 图片上传
router.post('/img', function (req, res) {
	const file = req.files[0];
	console.log(file);
	const oldname = file.filename;
	const newname = oldname + path.parse(file.originalname).ext;
	fs.renameSync('./public/images/' + oldname, './public/images/' + newname);
	res.send('images/' + newname);
});

//图片下载
router.get('/fileName/download', (req, res) => {
	const img = fs.readFileSync('./public/images');
});

//
//
//
//
//
//
//
//
//
//
//
//
//
//

module.exports = router;
