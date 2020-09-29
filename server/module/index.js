const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '10.8.8.120',
    database: 'front',
    password: '7to12pg12',
    port: 5412,
})

module.exports = function(sql, data = []){
    console.log('SQL:REQ:%s:%j', sql, data);
    return pool.query(sql, data).then((ret) => {
        console.log('SQL:RES:%s:%j', sql, ret.rows);
        return ret.rows
    })
}