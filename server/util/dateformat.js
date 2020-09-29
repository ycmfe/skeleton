/**
 * 判断是否为闰年
 * 闰年能被4整除且不能被100整除，或能被400整除。
 * @type {Function}
 */
const isLeapYear = exports.isLeapYear = function (year) {
    return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
};
/**
 * 获取当前月多少天
 * @param month
 * @param year
 * @returns {number}
 */
exports.daysInMonth = (month, year) => {
    return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};
/**
 * 切换日期
 * @param date {String} 2016-08-01
 * @param num {Number} 等于 0 当天
 *                       大于0  例如为1时 2016-07-31
 *                      小于0  例如为-1时 2016-08-02
 * */
let switchDate = exports.switchDate = function (date, num) {
    let thisTime = new Date(date).getTime();
    let lastTime = new Date(thisTime - (num * 86400000));
    let lastYear = lastTime.getFullYear();
    let lastMonth = (lastTime.getMonth() + 1) < 10 ? '0' + (lastTime.getMonth() + 1) : (lastTime.getMonth() + 1);
    let lastDay = lastTime.getDate() < 10 ? '0' + lastTime.getDate() : lastTime.getDate();
    let lastDate = lastYear + '-' + lastMonth + '-' + lastDay;
    return lastDate;
};
/**
 * 获取日期
 * @param  {Date} date []
 * @return {String}      []
 */
const datetime = exports.datetime = (date, format) => {
    let fn = d => {
        return ('0' + d).slice(-2);
    };

    if (date && _.isString(date)) {
        date = new Date(Date.parse(date));
    }
    let d = date || new Date();

    format = format || 'YYYY-MM-DD HH:mm:ss';
    let formats = {
        YYYY: d.getFullYear(),
        MM: fn(d.getMonth() + 1),
        DD: fn(d.getDate()),
        HH: fn(d.getHours()),
        mm: fn(d.getMinutes()),
        ss: fn(d.getSeconds())
    };

    return format.replace(/([a-z])\1+/ig, a => {
        return formats[a] || a;
    });
};
/**
 * 日期段相差多少天
 * @param startTime {Date} 2016-08-01
 * @param endTime {Date} 2016-08-10
 * @returns 10 {Number}
 * */
let getDateDiff = exports.getDateDiff = function (startTime, endTime) {
    let start = new Date(startTime).getTime();
    let end = new Date(endTime).getTime();
    return Math.abs((end - start) / 86400000);
};
/**
 * 日期段相差多少天
 * @param startTime {Date} 2016-08-01
 * @param endTime {Date} 2016-08-10
 * @returns 10 {Number}
 * */
let getDateDiffall = exports.getDateDiffall = function (startTime, endTime) {
    let start = new Date(startTime).getTime();
    let end = new Date(endTime).getTime();
    return (end - start) / 86400000;
};
/**
 * 当某天在这个时间段内返回从某天的截断的两段日期否则返回原来的日期段
 * @param startTime {Date} 2016-08-01
 * @param endTime {Date} 2016-08-10
 * @returns  包含某天 startTime 日期段开始日期 currentTime日期段结束日期 start_next截取日期段开始日期  endTime截取日期段结束日期
 * */
let getDatePara = exports.getDateExist = function (startTime, endTime, currentTime) {
    let start = new Date(startTime).getTime();
    let end = new Date(endTime).getTime();
    let currTime = new Date(currentTime).getTime();
    let start_next = util.df.switchDate(currentTime, -1);
    let dateItem = {
            'startActual': startTime,
            'endActual': currentTime,
            'startAlready': start_next,
            'endAlready': endTime
        }
    if (currTime >= end) {
        dateItem['endActual'] = endTime;
        dateItem['startAlready'] = '';
        dateItem['endAlready'] = '';
    }
    if (currTime < start) {
        dateItem['startAlready'] = startTime;
        dateItem['startActual'] = '';
        dateItem['endActual'] = '';
    }
    return dateItem;
}

/**
 * 获取日期段的去年同星期，去年同日期
 * @param dateArray {Array}  [ '2016-01-01','2016-01-31' ]  下标为0 开始日期，下标为1 结束日期
 * @param type {String} week 去年同星期 day 去年同日期
 * @returns {Array} week [2015-01-02,2015-01-31]  day [2015-01-01,2015-01-30]
 * */
let getLastSegment = exports.getLastSegment = function(dateArray, type){
    let array;
    if (dateArray.length === 2) {
        array = [util.df.getLastDate(dateArray[0], type), util.df.getLastDate(dateArray[1], type)];
    }
    return array;
};

/**
 * 获取当前日期对应的去年的日期
 * @param date 2016-01-01
 * @param type week/day
 * @returns {Object} year   属于哪一年第几周  num 第几周  week 周几 [0,1,2,3,4,5,6] 星期日为 0
 * {
     *  year:2015,
     *  num:53,
     *  week:5
     * }
 * */
let getLastDate = exports.getLastDate = function(date, type) {
    let thisDate = new Date(date);
    let lastYear = thisDate.getFullYear() - 1;
    let Month = thisDate.getMonth() + 1;
    let curDate = thisDate.getDate();
    if (Month == 2 && curDate == 29) {
        Month  = 3;
        curDate = 1;
    }
    let lastMonth = Month < 10 ? '0' + Month : Month;
    let lastDay = curDate < 10 ? '0' + curDate : curDate;
    let lastDate = '';
    if (type === 'week') {
        lastDate = util.df.switchDate(date, 364);// 364 Ϊ52*7
    }
    if (type === 'day') {
        lastDate = lastYear + '-' + lastMonth + '-' + lastDay;
    }
    return lastDate;
};
/**
 * 字符串转日期
 * @param str
 * @returns {Date}
 */
let strToDate = exports.strToDate = function (str) {
    let isoExp = /^\s*(\d{4})[-\/\u4e00-\u9fa5](\d\d?)[-\/\u4e00-\u9fa5](\d\d?)[\u4e00-\u9fa5]?\s*$/;
    let date = new Date();
    let month;
    let parts = isoExp.exec(str);
    if (parts) {
        month = +parts[2];
        date.setFullYear(parts[1], month - 1, parts[3]);
        if (month != date.getMonth() + 1) {
            date.setTime(NaN);
        }
    }
    return date;
};

/**
 * 这天是本年的第几天
 * @param d 默认是今天
 * @returns {number|*}
 */
exports.getWeekOfYear = function (d = new Date()) {
    let oneMonthDate = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - oneMonthDate) / 86400000) + oneMonthDate.getDay() + 1) / 7);
};
/**
 * 这天是本月的第几天
 * @param d 默认是今天
 * @returns {number|*}
 */
exports.getWeekOfMonth = function (d = new Date()) {
    var day = d.getDate();

    //get weekend date
    day += (d.getDay() == 0 ? 0 : 7 - d.getDay());

    return Math.ceil(parseFloat(day) / 7);
};
/**
 * 获取一个区间内，指定的周有那些天（例如：['2016-07-05', '2016-08-15']中周一那些天是周一）
 * @param dates {Array} 需要筛选的日期有那些, 如果type === 'section'，第一项是开始日期，第二项是结束日期
 * @param weeks {Array} 筛选的周有那些 [0,1,2,3,4,5,6]
 * @param type {String} 默认section
 * @returns {Array}
 */
exports.filterWeek = function (dates, weeks = [0, 1, 2, 3, 4, 5, 6], type = 'section') {
    let arr = [];
    if (type === 'section') {
        let startTime = strToDate(dates[0]);
        let endTime = strToDate(dates[1]);
        let currTime = startTime;
        while (currTime.getTime() <= endTime.getTime()) {
            let currYear = currTime.getFullYear();
            let currMonth = currTime.getMonth() + 1;
            if (currMonth < 10) {
                currMonth = `0${currMonth}`
            }
            let currDate = currTime.getDate();
            if (currDate < 10) {
                currDate = `0${currDate}`
            }
            let currWeek = currTime.getDay();

            for (let i = 0; i < weeks.length; i++) {
                if (currWeek == weeks[i]) {
                    arr.push(`${currYear}-${currMonth}-${currDate}`);
                    break;
                }
            }

            currTime.setDate(parseInt(currDate) + 1);

        }
    } else {
        dates.forEach(function (item) {
            let currTime = strToDate(item);
            let currYear = currTime.getFullYear();
            let currMonth = currTime.getMonth() + 1;
            if (currMonth < 10) {
                currMonth = `0${currMonth}`
            }

            let currDate = currTime.getDate();
            if (currDate < 10) {
                currDate = `0${currDate}`
            }
            let currWeek = currTime.getDay();

            for (let i = 0; i < weeks.length; i++) {
                if (currWeek === weeks) {
                    arr.push(`${currYear}-${currMonth}-${currDate}`);
                }
            }
        });
    }


    return arr;

};
/**
 * 获取DOW
 * @param data {Array} 具体的值
 * @param item {Array} 需要计算的参数
 * @returns {Array}
 */
let dayOfWeek = exports.dayOfWeek = function (data, item = ['tosell', 'rooms', 'ooo']) {
    let temp = [];
    // 求星期数组
    for (let i = 0; i < 7; i++) {
        let obj = {
            len: 0,
            week: i
        };
        item.forEach((key) => {
            obj[key] = 0;
        });
        temp.push(obj);
    }

    // 根据日期获取星期几，然后修改星期数组数据
    data.forEach((d) => {
        // 日期处理
        let _date = util.strToDate(d.date || d.live_dt);
        let week = _date.getDay();
        // 汇总所有需要汇总的
        item.forEach((key) => {
            //console.log(key, d[key], week, d, item, _date);
            temp[week][key] = parseFloat(temp[week][key] || 0) + parseFloat(d[key] || 0);
        });
        // 补全所有参数
        let keys = Object.keys(d);
        keys.forEach((key) => {
            if (!temp[week][key] && key !== 'date') {
                temp[week][key] = parseFloat(d[key] || 0)
            }
        });
        temp[week]['len'] = temp[week]['len'] + 1;
    });
    // 按照星期1-7排序
    let sunday = temp.shift();
    temp = temp.concat(sunday);

    temp.forEach((item, index) => {
        if (item.len === 0) {
            temp[index]['len'] = 1;
        }
    });


    return temp;
};
/**
 * 分开历史和未来（包含今天）为2个数组
 * @param dates {Array}
 * @returns {{history: Array, future: Array}}
 */
exports.historyAndFuture = function (dates, date) {
    let history = [];
    let future = [];
    let now = strToDate(date);
    dates.forEach((d) => {
        let time = strToDate(d);
        if (time < now) {
            history.push(d);
        } else {
            future.push(d);
        }
    });

    return {
        history,
        future
    }
};