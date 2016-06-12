require('dotenv').config({silent: true});
const env = process.env;

const express = require('express');
const wechat = require('wechat');

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

  let message = req.weixin;
  console.log('/wechat:', message);
  res.reply('Success!');

}));

app.use('/wechat-test', wechat(wechatTestConfig, (req, res, next) => {

  let message = req.weixin;
  console.log('/wechat-test:', message);
  res.reply('Test Success!');

}));


const port = env.PORT || 5000;
const host = '0.0.0.0';
app.listen(port, host, () => console.log(`Server on http://${host}:${port}`));
