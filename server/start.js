require('dotenv').config({silent: true});
const env = process.env;

const express = require('express');
const wechat = require('wechat');
const fetch_video_from_url = require('./mixin/fetch_video_from_url').default

// https://mora-bot.herokuapp.com/wechat
// test account: http://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
const wechatConfig = {
  token: env.WECHAT_TOKEN,
  appid: env.WECHAT_APP_ID,
  encodingAESKey: env.WECHAT_ENCODING_AES_KEY
};
const wechatTestConfig = Object.assign({}, wechatConfig, {
  appid: env.TEST_WECHAT_APP_ID
});


let app = express();
app.use(express.query());

app.use('/wechat', wechat(wechatConfig, (req, res, next) => {
  console.log('/wechat:', req.weixin);
  parse(req, res, next)
}));

app.use('/wechat-test', wechat(wechatTestConfig, (req, res, next) => {
  console.log('/wechat-test:', req.weixin);
  parse(req, res, next)
}));


const port = env.PORT || 5000;
const host = '0.0.0.0';
app.listen(port, host, () => console.log(`Server on http://${host}:${port}`));


function parse(req, res, next) {
  let message = req.weixin;

  fetch_video_from_url(message, res)
    .then(result => {
      if (!result) res.reply('对不起，暂时无法解析您提供的内容!');
    })
    .catch(e => {
      console.error(e)
      res.reply('系统错误：' + e.message)
    })
}
