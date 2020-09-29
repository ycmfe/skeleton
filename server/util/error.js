exports.ERR_OK = {
    "status": {
        "code": 200,
        "msg": "OK"
    },
    "data": {}
};
// 100 系统级别错误
exports.ERR_SYSTEM_ERROR = {
    "status": {
        "code": 100,
        "msg": "系统错误"
    }
};
// 100 系统级别错误
exports.ERR_ERROR = {
    "status": {
        "code": 100,
        "msg": "系统错误"
    }
};
// 2000 参数错误
exports.ERR_LIVE_DATE = {
    "status": {
        "code": 2000,
        "msg": "请填写查询条件"
    }
};
// 2001 参数错误
exports.ERR_IS_EXISTS = {
    "status": {
        "code": 2001,
        "msg": "已存在"
    }
};
// 2002 参数错误
exports.ERR_DINNER_IS_EXISTS = {
    "status": {
        "code": 2002,
        "msg": "该餐饮代码已使用"
    }
};
// 2500 用户相关
exports.ERR_USER_LOGIN = {
    "status": {
        "code": 2500,
        "msg": "用户名密码错误"
    }
};
exports.ERR_USER_TOKEN = {
    "status": {
        "code": 2501,
        "msg": "请重新登录"
    }
};

exports.ERR_USER_WRONG = {
    "status": {
        "code": 2502,
        "msg": "校验错误"
    }
};

exports.ERR_LOGIN_TIMEOUT = {
    "status": {
        "code": 2503,
        "msg": "登陆超时"
    }
};

// 报表

exports.ERR_REPORT_UPDATE_FAVORITE = {
    "status": {
        "code": 3001,
        "msg": "收藏失败"
    }
};
exports.ERR_REPORT_DELETE_FAVORITE = {
    "status": {
        "code": 3001,
        "msg": "删除失败"
    }
};
exports.ERR_REPORT_GET_FAVORITE = {
    "status": {
        "code": 3003,
        "msg": "获取收藏列表失败"
    }
};
exports.ERR_REPORT_GET_HISTORY_DAY = {
    "status": {
        "code": 3004,
        "msg": "获取日业绩表现信息失败"
    }
};
exports.ERR_REPORT_GET_HISTORY_HOTEL = {
    "status": {
        "code": 3005,
        "msg": "获取酒店业绩信息失败"
    }
};
exports.ERR_REPORT_PARA_CD_LOST = {
    "status": {
        "code": 3006,
        "msg": "细分市场小类不存在"
    }
};
exports.ERR_REPORT_TYPE_LOST = {
    "status": {
        "code": 3007,
        "msg": "指标不存在"
    }
};
exports.ERR_REPORT_LEVEL_LOST = {
    "status": {
        "code": 3008,
        "msg": "级别不存在"
    }
};
exports.ERR_REPORT_CONTRAST_LOST = {
    "status": {
        "code": 3009,
        "msg": "对比方式不存在"
    }
};
exports.ERR_REPORT_LIVEDATE_LOST = {
    "status": {
        "code": 3010,
        "msg": "入住日期不存在"
    }
};
exports.ERR_REPORT_DIMENSION_LOST = {
    "status": {
        "code": 3011,
        "msg": "维度不存在"
    }
};
//observe_dt
exports.ERR_REPORT_OBSERVE_LOST = {
    "status": {
        "code": 3012,
        "msg": "观察日期不存在"
    }
};
exports.ERR_REPORT_BARRATE_LOST = {
    "status": {
        "code": 3013,
        "msg": "获取数据失败"
    }
};
//预订获取
exports.ERR_REPORT_MAPPING_LOST = {
    "status": {
        "code": 3014,
        "msg": "大类小类对应关系不存在"
    }
};
exports.ERR_REPORT_GROUP_LOST = {
    "status": {
        "code": 3015,
        "msg": "分组对应关系不存在"
    }
};
exports.ERR_REPORT_MARKET_CODE_LOST = {
    "status": {
        "code": 3016,
        "msg": "细分市场小类不存在"
    }
};
// NOTE
exports.ERR_NOTE_SELECT = {
    "status": {
        "code": 3017,
        "msg": "获取NOTE失败"
    }
};
exports.ERR_NOTE_ADD = {
    "status": {
        "code": 3018,
        "msg": "添加NOTE失败"
    }
};
exports.ERR_NOTE_UPDATE = {
    "status": {
        "code": 3019,
        "msg": "修改NOTE失败"
    }
};
exports.ERR_NOTE_DEL = {
    "status": {
        "code": 3020,
        "msg": "删除NOTE失败"
    }
};
// NOTE
exports.ERR_HOLIDAY_SELECT = {
    "status": {
        "code": 3021,
        "msg": "获取节假日失败"
    }
};
exports.ERR_NOTE_ADD = {
    "status": {
        "code": 3022,
        "msg": "添加节假日失败"
    }
};
exports.ERR_NOTE_UPDATE = {
    "status": {
        "code": 3023,
        "msg": "修改节假日失败"
    }
};
exports.ERR_NOTE_DEL = {
    "status": {
        "code": 3024,
        "msg": "删除节假日失败"
    }
};
// 预测价格
exports.ERR_PRICE_FC_SELECT = {
    "status": {
        "code": 3025,
        "msg": "获取预测价格失败"
    }
};
//定价
exports.ERR_PRICING_UPDATE = {
    "status": {
        "code": 3026,
        "msg": "重新定价失败"
    }
};

//pickup
exports.ERR_PICKUP_MAPPING = {
    "status": {
        "code": 3027,
        "msg": "pickup需要维度的mapping关系"
    }
};
//verify
exports.ERR_VERIFY_TYPE = {
    "status": {
        "code": 3028,
        "msg": "type参数错误"
    }
};
//upload 预算
exports.ERR_UPLOAD_BUDGET_PARAM = {
    "status": {
        "code": 3029,
        "msg": "缺少导入参数"
    }
};
//upload 预算
exports.ERR_UPLOAD_BUDGET_TYPE = {
    "status": {
        "code": 3030,
        "msg": "导入模板与所选类型不匹配"
    }
};
//upload 预算
exports.ERR_UPLOAD_BUDGET_VERIFY = {
    "status": {
        "code": 3031,
        "msg": "导入数据验证不通过"
    }
};
//upload 预算
exports.ERR_UPLOAD_BUDGET_EXIST = {
    "status": {
        "code": 3032,
        "msg": "该数据已存在是否覆盖"
    }
};
//upload 预算
exports.ERR_UPLOAD_BUDGET_UPLOADING = {
    "status": {
        "code": 3033,
        "msg": "数据导入中"
    }
};
