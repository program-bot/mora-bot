"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../inc/util");
var puppeteer = require("puppeteer");
var debug = require("debug");
var bot = require('../../libs/wechat-bot');
var log = debug('fetch:video');
function default_1(message, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var url, content;
        return tslib_1.__generator(this, function (_a) {
            if (message.MsgType === 'text') {
                content = message.Content;
                if (/^https?:\/\//.test(content))
                    url = content;
            }
            else if (message.MsgType === 'link') {
                url = message.Url;
            }
            if (url) {
                res.reply("\u6B63\u5728\u89E3\u6790 " + url + " \u4E2D\u7684\u89C6\u9891\uFF0C\u8BF7\u7A0D\u5019...");
                fetchVideoTo(url, function (text) {
                    log("===> \u8FD4\u56DE\u7ED3\u679C: " + text);
                    bot.promisify('sendText')(message.FromUserName, text);
                });
                return [2, true];
            }
            return [2, false];
        });
    });
}
exports.default = default_1;
function fetchVideoTo(url, send) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fetchVideo(url)];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        send('无法获取任何视频地址');
                    }
                    else if (result.error) {
                        send(result.error);
                    }
                    else if (result.video) {
                        send(result.title + " " + result.video);
                    }
                    return [2];
            }
        });
    });
}
function fetchVideo(url) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _this = this;
        var browser, page, video, error, title;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log('打开浏览器...');
                    return [4, puppeteer.launch({
                            args: ['--no-sandbox', '--disable-setuid-sandbox']
                        })];
                case 1:
                    browser = _a.sent();
                    log('新建页面...');
                    return [4, browser.newPage()];
                case 2:
                    page = _a.sent();
                    page.on('response', function (response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var url, text, res, all_1, max_1;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (response.status !== 200)
                                        return [2];
                                    url = response.url;
                                    if (!url.startsWith('https://ib.365yg.com/video/urls/v/1/toutiao/mp4/')) return [3, 2];
                                    log("\u89E3\u6790\u5230\u5934\u6761\u7684\u89C6\u9891\u4FE1\u606F\u5730\u5740 " + url + "\uFF0C\u5F00\u59CB\u83B7\u53D6\u5176\u5185\u5BB9...");
                                    return [4, response.text()];
                                case 1:
                                    text = _a.sent();
                                    if (/^\w+\((.*)\)$/.test(text)) {
                                        res = JSON.parse(RegExp.$1);
                                        if (res.code !== 0) {
                                            error = '头条返回的 code 不为 0：' + text;
                                        }
                                        else {
                                            all_1 = res.data.video_list;
                                            max_1 = null;
                                            Object.keys(all_1).forEach(function (key) {
                                                if (!max_1)
                                                    max_1 = all_1[key];
                                                else if (parseInt(max_1.definition, 10) < parseInt(all_1[key].definition, 10))
                                                    max_1 = all_1[key];
                                            });
                                            video = util_1.base64.decode(max_1.main_url);
                                            log("===> \u89C6\u9891\u5730\u5740\u4E3A " + video);
                                        }
                                    }
                                    _a.label = 2;
                                case 2: return [2];
                            }
                        });
                    }); });
                    log("\u8DF3\u8F6C\u5230\u5730\u5740 " + url + " ...");
                    return [4, page.goto(url)];
                case 3:
                    _a.sent();
                    if (!video) return [3, 5];
                    log("\u83B7\u53D6\u9875\u9762\u6807\u9898...");
                    return [4, page.title()];
                case 4:
                    title = _a.sent();
                    log("===> \u9875\u9762\u6807\u9898\u4E3A " + title);
                    _a.label = 5;
                case 5:
                    log("\u5173\u95ED\u6D4F\u89C8\u5668...");
                    return [4, browser.close()];
                case 6:
                    _a.sent();
                    log("===> \u6D4F\u89C8\u5668\u5173\u95ED\u6210\u529F\uFF01");
                    return [2, (video || error) ? { video: video, error: error, title: title } : null];
            }
        });
    });
}
exports.fetchVideo = fetchVideo;
