require('dotenv').config({silent: true});

const env = process.env;
const TPL = {
  INFO: 'SYla3VNxKxeBKaHfh9XnjA-bAEzEYGEDUH8s5itoImc',
  SUCCESS: '898eGya5eI4GVBGKVUU9Wz9ICYn5LbzD6j0G9WrKGJk',
  ERROR: 'nsK8utkVPALWOpme95yoRwsg1jMivH7cBWK99oSx9uU'
};
const COLOR = {
  INFO: '#2828d8',
  SUCCESS: '#00ff00',
  ERROR: '#ff0000'
};
const MY_OPEN_ID = 'oHwgPv42MXp8ckI4GsW3VyN8AFNY';  // iPhone
// const MY_OPEN_ID = 'oHwgPv6YY7txYDxHy6lO5S2Y5fgQ'; // Android

// 注意发送的字符不能超过 2kb（一个中文占 3 bytes）
const MAX_CONTENT_BYTES = 2048 - 10; // 不要滿额（防止出错）
const WechatAPI = require('wechat-api');

const api = new WechatAPI(
  env.TEST_WECHAT_APP_ID,
  env.TEST_WECHAT_APP_SECRET,
  // 获取保存的 token （注意 token 是个对象，包括过期时间）
  function getToken(cb) { cb(null, this.store); },
  // 设置从微信服务器上取得的 token
  function saveToekn(token, cb) { this.store = token && cb(null); }
);

// @FIXME SurrogatePairs（如 🐎）字符无法发送
// send('中'.repeat(683));
function send(content, level = 'INFO', shouldReportError = false) {
  if (typeof content !== 'string') content = JSON.stringify(content);

  slice(content, MAX_CONTENT_BYTES).forEach(message => {
    sendTemplateMessageTo(message, MY_OPEN_ID, level)
      .catch(e => {
        console.log('模板消息发送发送失败，尝试使用客服消息');
        return sendMessageTo(message, MY_OPEN_ID);
      })
      .catch(e => {
        console.log('客服消息失败，尝试发送批量消息');
        return sendMessageToMultiple(message, [MY_OPEN_ID, MY_OPEN_ID]); // 必须发送给两个人以上
      })
      .catch(e => {
        if (shouldReportError) sendError(e);
        else console.error(e);
      });
  });
}

function sendTemplateMessageTo(message, receiver, level = 'INFO') {
  level = level.toUpperCase();
  if (!TPL[level]) level = 'INFO';
  // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
  let url = 'https://dashboard.heroku.com/apps/mora-bot/logs';
  let data = {
    content: {
      value: message,
      color: COLOR[level]
    }
  };
  return promisify('sendTemplate').call(null, receiver, TPL[level], url, data);
}

function sendMessageTo(message, receiver) {
  return promisify('sendText').call(null, receiver, message);
}

function sendMessageToMultiple(message, receivers) {
  return promisify('massSendText').apply(null, arguments);
}


const ERROR_PREFIX = `
　 　 　 _=|=_
　 　 　  (o o)
+---oOO-{_}-OOo----+

 Error: `;
function sendError(any) {
  send(ERROR_PREFIX + JSON.stringify(any), false, 'ERROR');
}

function sendSuccess(any) {
  send(JSON.stringify(any), false, 'SUCCESS');
}

module.exports = {
  api,
  send,
  sendError,
  sendSuccess
};

function promisify(fnKey) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push((err, body, xhr) => {
        if (err) reject(body);
        else resolve(body);
      });
      api[fnKey].apply(api, args);
    });
  };
}

function slice(message, max) {
  let res = [], current = '', length = 0, l;
  for (let char of message) {
    l = utf8CharLength(char);

    if (length + l > max) {
      res.push(current);
      current = char;
      length = l;
    } else {
      current += char;
      length += l;
    }
  }

  if (length) res.push(current);
  return res;
}

function utf8CharLength(char) {
  let code = char.charCodeAt(0);
  if (code <= 0x7F) return 1;        // 0xxxxxxx
  else if (code <= 0x7FF) return 2;  // 110xxxxx10xxxxxx
  else if (code <= 0xFFFF) return 3; // 1110xxxx10xxxxxx10xxxxxx
  else return 4;                     // 11110xxx10xxxxxx10xxxxxx10xxxxxx
}


