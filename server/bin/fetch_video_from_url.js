"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fetch_video_from_url_1 = require("../mixin/fetch_video_from_url");
var path = require("path");
var fs = require("fs");
var cli = require("mora-scripts/libs/tty/cli");
var mkdirp = require("mora-scripts/libs/fs/mkdirp");
var download = require('download');
cli({
    usage: 'fetch_video_from_url <link>'
})
    .options({
    't | title': '<string> 指定视频的标题（下载的时候有用）',
    'd | download': '<boolean> 下载解析后的视频',
    'o | outDir': '<string> 指定下载目录（ 默认是 /Users/Mora/Downloads/Videos ）'
})
    .parse(function (res) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var url, result, video, title, distFile;
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
                    video = result.video;
                    title = (res.title || result.title || '<无标题视频>');
                    if (!(/\.\w+$/.test(title)))
                        title += '.mp4';
                    console.log("title: " + title);
                    console.log("video: " + video);
                    if (res.download) {
                        distFile = path.resolve(res.outDir || '/Users/Mora/Downloads/Videos', title);
                        if (fs.existsSync(distFile)) {
                            this.error("\u6587\u4EF6 " + distFile + " \u5DF2\u7ECF\u5B58\u5728\u4E86\uFF01");
                            return [2];
                        }
                        mkdirp(path.dirname(distFile));
                        console.log("\u4E0B\u8F7D\u89C6\u9891\u5230\u76EE\u5F55 " + distFile + " \u4E2D...");
                        download(video).pipe(fs.createWriteStream(distFile));
                    }
                    return [2];
            }
        });
    });
});
