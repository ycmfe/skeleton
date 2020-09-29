const maps = {
    js: 0,
    css: 1,
    img: 2,
    font: 3,
    other: 4
}
exports.get = function(options){
    let data = [];
    let keys = [];
    let sql = '';

    let index = 0;
    for (const key in options) {
        if (options.hasOwnProperty(key)) {
            let item = options[key];
            if(key === 'category'){
                item = maps[item] || 4
            }
            data.push(item);
            keys.push(`${key}=$${index + 1}`);
            index = index + 1;
        }
    }

    if(keys.length){
        sql = `where ${keys.join(' and ')}`;
    }

    return db(`select * from cdn ${sql} ORDER BY createtime DESC`, data)
}

exports.post = function(options){
    let data = [];
    let keys = [];
    let values = [];
    let index = 0;
    for (const key in options) {
        if (options.hasOwnProperty(key)) {
            let item = options[key];
            if(key === 'category'){
                item = maps[item] || 4
            }
            data.push(item);
            keys.push(key);
            values.push(`$${index + 1}`)
            index = index + 1;
        }
    }
    return db(`INSERT INTO cdn(${keys.join(',')}) VALUES(${values.join(',')}) RETURNING *`, data)
}