var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hospital',
    port: 3306,
});

module.exports = {
    sql(json) {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return;
            }
            var sql = json.sql;
            connection.query(sql, json.arr, (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                json.data(data);
                connection.release();
            });
        });
    }
}