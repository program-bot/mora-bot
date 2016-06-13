require('dotenv').config({silent: true});


const env = process.env;
const WechatAPI = require('wechat-api');
const fs = require('fs');
const path = require('path');

const tokenPath = path.join(__dirname, '..', 'data', 'wechat-bot-token.json');


let bot = new WechatAPI(
  env.TEST_WECHAT_APP_ID,
  env.TEST_WECHAT_APP_SECRET,

  // 获取保存的 token （注意 token 是个对象，包括过期时间）
  function getToken(cb) {
    fs.readFile(tokenPath, 'utf8', (err, content) => {
      if (!err || err.code === 'ENOENT') {
        let token = content ? JSON.parse(content) : null;
        cb(null, token);
      } else {
        cb(err);
      }
    });
  },

  // 设置从微信服务器上取得的 token
  function saveToekn(token, cb) {
    fs.writeFile(tokenPath, JSON.stringify(token), cb);
  }
);

bot.promisify = function (key) {
  return promisify(key, bot);
};

module.exports = bot;


function promisify(key, target) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push((err, body, xhr) => {
        if (err) reject(body);
        else resolve(body);
      });
      target[key].apply(target, args);
    });
  };
}
