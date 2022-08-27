var express = require('express');
var mysql = require('./sql');
var router = express.Router();

/* GET home page. */

// 删除备忘录
router.post('/delM', (req, res) => {
    var json = req.data;
    console.log(json, 1111111);
    mysql.sql({
        sql: `delete from data where uid=? and user=?`,
        arr: [json.uid, json.user],
        data(data) {
            console.log(data, 222222);
            mysql.sql({
                sql: `select uid,title,content,time from data where user=?`,
                arr: [json.user],
                data(data) {
                    // console.log(data);
                    res.send({
                        ok: 0,
                        data: data
                    })
                }
            })
        }
    })
});

// 修改备忘录
router.post('/updataM', (req, res) => {
    var json = req.data;
    console.log(json, 1111111);
    mysql.sql({
        sql: `update data set title=?,content=? where uid=? and user=?`,
        arr: [json.title, json.content, json.uid, json.user],
        data(data) {
            console.log(data, 222222);
            mysql.sql({
                sql: `select uid,title,content,time from data where user=?`,
                arr: [json.user],
                data(data) {
                    // console.log(data);
                    res.send({
                        ok: 0,
                        data: data
                    })
                }
            })
        }
    })
});

// 获取备忘录
router.get('/getT', (req, res) => {
    var json = req.data;
    // console.log(json);
    mysql.sql({
        sql: `select uid,title,content,time from data where user=?`,
        arr: [json.user],
        data(data) {
            // console.log(data);
            res.send({
                ok: 0,
                data: data
            })
        }
    })
});

// 创建备忘录
router.post('/createM', function (req, res, next) {
    var json = req.data;
    console.log(json);
    mysql.sql({
        sql: `insert into data (user,title,content) values(?,?,?)`,
        arr: [json.user, json.title, json.content],
        data(data) {
            console.log(data, 22222222222222);
            mysql.sql({
                sql: 'select * from data where user=?',
                arr: [json.user],
                data(data) {
                    console.log(data);
                    res.send({
                        ok: 0,
                        data: data
                    });
                }
            })
        }
    });

});

module.exports = router;