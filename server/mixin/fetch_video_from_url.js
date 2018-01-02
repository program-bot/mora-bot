"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../inc/util");
var puppeteer = require("puppeteer");
var currentUrl = null;
function default_1(message, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var result, url, content;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = null;
                    if (message.MsgType === 'text') {
                        content = message.Content;
                        if (/^https?:\/\//.test(content)) {
                            url = content;
                        }
                    }
                    else if (message.MsgType === 'link') {
                        url = message.Url;
                    }
                    if (!url) return [3, 2];
                    if (currentUrl === url)
                        return [2, true];
                    else if (currentUrl) {
                        res.reply('当前正在处理其它资源，请稍后');
                        return [2, true];
                    }
                    currentUrl = url;
                    return [4, fetchVideo(url)];
                case 1:
                    result = _a.sent();
                    currentUrl = null;
                    _a.label = 2;
                case 2:
                    if (!result)
                        return [2, false];
                    if (result.error) {
                        res.reply(result.error);
                    }
                    else if (result.video) {
                        res.reply(result.title + " " + result.video);
                    }
                    return [2, true];
            }
        });
    });
}
exports.default = default_1;
function fetchVideo(url) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _this = this;
        var browser, page, video, error, title;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, puppeteer.launch({
                        args: ['--no-sandbox', '--disable-setuid-sandbox']
                    })];
                case 1:
                    browser = _a.sent();
                    console.log(browser.wsEndpoint());
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
                                        }
                                    }
                                    _a.label = 2;
                                case 2: return [2];
                            }
                        });
                    }); });
                    return [4, page.goto(url)];
                case 3:
                    _a.sent();
                    if (!video) return [3, 5];
                    return [4, page.title()];
                case 4:
                    title = _a.sent();
                    _a.label = 5;
                case 5: return [4, browser.close()];
                case 6:
                    _a.sent();
                    return [2, (video || error) ? { video: video, error: error, title: title } : null];
            }
        });
    });
}
exports.fetchVideo = fetchVideo;
