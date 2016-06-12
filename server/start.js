require('dotenv').config({silent: true});
const env = process.env;

const express = require('express');
const wechat = require('wechat');
const wechatConfig = {
  token: env.WECHAT_TOKEN,
  appid: env.WECHAT_APP_ID,
  encodingAESKey: env.WECHAT_ENCODING_AES_KEY
};


let app = express();
app.use(express.query());
app.use('/wechat', wechat(wechatConfig, (req, res, next) => {

  let message = req.weixin;
  console.log(message);
  res.reply('Success!');

}));


const port = env.PORT || 5000;
const host = '0.0.0.0';
app.listen(port, host, () => console.log(`Server on http://${host}:${port}`));
