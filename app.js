const Koa = require('koa');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const path = require('path');

const upload = require('./routes/upload.js');
const index = require('./routes/index.js');

//koa实例化
const app = new Koa();
const router = new Router();

//开启跨域
const cors = require('@koa/cors');
app.use(cors());
app.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*');
	ctx.set(
		'Access-Control-Allow-Headers',
		'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
	);
	ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	if (ctx.method == 'OPTIONS') {
		ctx.body = 200;
	} else {
		await next();
	}
});

// 总路由添加前缀/api,总地址变为http://localhost:3000/api
router.prefix('/api');

router.get('/', async ctx => {
	ctx.body = 'hello World';
});
// 子路由添加前缀/users,最后访问地址变为http://localhost:3000/api/users/user
router.use('/upload', upload.routes());
router.use('/index', index.routes());

app.use(router.routes()).use(router.allowedMethods());

app.use(koaStatic(path.join(__dirname, 'dist')));

app.listen(8888, () => {
	console.log('端口运行在：', 8888);
});

module.exports = app;
