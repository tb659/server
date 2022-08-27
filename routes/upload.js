const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

const TEMPORARY_FILES = path.join(__dirname, '../public/temporary');
const STATIC_FILES = path.join(__dirname, '../public');

router.get('/alreadyFile', async ctx => {
	const { filename } = ctx.query;
	const already = [];
	// fs.readdirSync,该方法将返回一个包含“指定目录下所有文件名称”的数组对象
	// 切片文件目下没有 `${filename}`的文件夹，那就是还没开始上传
	if (!fs.existsSync(`${TEMPORARY_FILES}\\${filename}`)) {
		ctx.body = already;
	} else {
		// 有文件夹，那就获取该文件夹下面切片的文件名
		fs.readdirSync(`${TEMPORARY_FILES}\\${filename}`).forEach(name => {
			already.push(Number(name));
		});
		ctx.body = already;
	}
});

router.post('/upload', async ctx => {
	let form = new formidable.IncomingForm();
	form.parse(ctx.req, (err, value, files) => {
		// 切片保存在temporary目录下的那个文件夹下
		let dir = `${TEMPORARY_FILES}\\${value.filename}`;
		// 第几个切片
		let hash = value.hash;
		let chunk = files.chunk;
		const buffer = fs.readFileSync(chunk.filepath);
		try {
			//  是否存在这个文件夹
			if (!fs.existsSync(dir)) {
				// 创建
				fs.mkdirSync(dir);
			}
			//  创建切片文件
			const ws = fs.createWriteStream(`${dir}\\${hash}`);
			//  切片写入
			ws.write(buffer);
			ws.close();
		} catch (error) {
			console.error(error);
		}
	});
	ctx.body = 'ok';
});

router.get('/fileLink', async ctx => {
	const { filename } = ctx.query;
	try {
		//  在public目录下是否存在这个文件，有就直接返回链接，ctx.origin获取域名
		if (fs.existsSync(`${STATIC_FILES}\\${filename}`)) {
			ctx.body = { url: `${ctx.origin}/${filename}` };
		}
	} catch (error) {
		console.error(error);
	}

	try {
		let len = 0;
		// fs.readdirSync,该方法将返回一个包含“指定目录下所有文件名称”的数组对象
		const bufferList = fs.readdirSync(`${TEMPORARY_FILES}\\${filename}`).map((hash, index) => {
			// 读取切片数据
			const buffer = fs.readFileSync(`${TEMPORARY_FILES}\\${filename}\\${index}`);
			len += buffer.length;
			return buffer;
		});
		// 合并切片文件
		//  返回一个连接了 list 中所有 Buffer 的新 Buffe
		const buffer = Buffer.concat(bufferList, len);
		// 在public下创建文件
		const ws = fs.createWriteStream(`${STATIC_FILES}\\${filename}`);
		ws.write(buffer);
		ws.close();
	} catch (error) {
		console.error(error);
	}
	// 删除文件流
	removeDir(`${TEMPORARY_FILES}\\${filename}`);
	ctx.body = { url: `${ctx.origin}/${filename}` };
});

function removeDir(dir) {
	let files = fs.readdirSync(dir);
	for (var i = 0; i < files.length; i++) {
		let newPath = path.join(dir, files[i]);
		let stat = fs.statSync(newPath);
		if (stat.isDirectory()) {
			//如果是文件夹就递归下去
			removeDir(newPath);
		} else {
			//删除文件
			fs.unlinkSync(newPath);
		}
	}
	fs.rmdirSync(dir); //如果文件夹是空的，就将自己删除掉
}

module.exports = router;
