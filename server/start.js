"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express = require("express");
var fetch_video_from_url_1 = require("./mixin/fetch_video_from_url");
var Cache_1 = require("./inc/Cache");
require('dotenv').config({ silent: true });
var env = process.env;
var wechat = require('wechat');
var wechatConfig = {
    token: env.WECHAT_TOKEN,
    appid: env.WECHAT_APP_ID,
    encodingAESKey: env.WECHAT_ENCODING_AES_KEY
};
var wechatTestConfig = Object.assign({}, wechatConfig, {
    appid: env.TEST_WECHAT_APP_ID
});
var app = express();
app.use('/wechat', wechat(wechatConfig, function (req, res, next) {
    console.log('/wechat:', req.weixin);
    parse(req, res, next);
}));
app.use('/wechat-test', wechat(wechatTestConfig, function (req, res, next) {
    console.log('/wechat-test:', req.weixin);
    parse(req, res, next);
}));
var port = env.PORT || 5000;
var host = '0.0.0.0';
app.listen(port, host, function () { return console.log("Server on http://" + host + ":" + port); });
function parse(req, res, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var message, lastWechatMessageId, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message = req.weixin;
                    return [4, Cache_1.default.get('lastWechatMessageId')];
                case 1:
                    lastWechatMessageId = _a.sent();
                    if (lastWechatMessageId === message.MsgType)
                        return [2, res.reply('消息处理中...')];
                    Cache_1.default.set('lastWechatMessageId', message.MsgId);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, fetch_video_from_url_1.default(message, res)];
                case 3:
                    if (!(_a.sent())) {
                        res.reply('暂时无法解析您提供的内容!');
                    }
                    return [3, 5];
                case 4:
                    e_1 = _a.sent();
                    console.error(e_1);
                    res.reply('系统错误：' + e_1.message);
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
