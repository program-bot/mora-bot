"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fetch_video_from_url_1 = require("../mixin/fetch_video_from_url");
var cli = require("mora-scripts/libs/tty/cli");
cli({
    usage: 'fetch_video_from_url <link>'
})
    .parse(function (res) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var url, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (res._.length === 0)
                        return [2, this.error('需要指定要解析的网页地址')];
                    if (res._.length > 1)
                        return [2, this.error('每次只支持解析一个网页地址')];
                    url = res._[0];
                    return [4, fetch_video_from_url_1.fetchVideo(url)];
                case 1:
                    result = _a.sent();
                    if (!result)
                        return [2, this.error('从您提供的网页地址中解析不到视频地址')];
                    if (result.error)
                        return [2, this.error(result.error)];
                    console.log("title: " + result.title);
                    console.log("video: " + result.video);
                    return [2];
            }
        });
    });
});
