const api = require('./wechat-bot');

// 注意发送的字符不能超过 2kb（一个中文占 3 bytes）
const MAX_CONTENT_BYTES = 512; // 不要滿额（防止出错）
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

// @FIXME SurrogatePairs（如 🐎）字符无法发送
function send(content, level = 'INFO', shouldReportError = false) {
  if (typeof content !== 'string') content = JSON.stringify(content);

  level = level.toUpperCase();
  content = level + ': ' + content;

  slice(content, MAX_CONTENT_BYTES).forEach(message => {
    sendMessageTo(message, MY_OPEN_ID)
      .catch(e => {
        console.log(e, '客服消息发送失败，尝试使用模板消息');
        return sendTemplateMessageTo(message, MY_OPEN_ID, level);
      })
      .catch(e => {
        console.log(e, '模板消息发送失败，尝试使用批量消息');
        return getGroupId(MY_OPEN_ID).then(data => {
          return sendMessageToMultiple(message, data.groupid);
        });
      })
      .catch(e => {
        if (shouldReportError) sendError(e);
        else console.error(e);
      });
  });
}

function sendError(any) {
  send(any, 'ERROR', false);
}

function sendSuccess(any) {
  send(any, 'SUCCESS', false);
}

module.exports = {
  api,
  send,
  sendError,
  sendSuccess
};

function sendMessageTo(message, receiver) {
  return api.promisify('sendText')(receiver, message);
}

function sendTemplateMessageTo(message, receiver, level = 'INFO') {
  if (!TPL[level]) level = 'INFO';
  // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
  let url = 'https://dashboard.heroku.com/apps/mora-bot/logs';
  let data = {
    content: {
      value: message,
      color: COLOR[level]
    }
  };
  return api.promisify('sendTemplate')(receiver, TPL[level], url, data);
}

// 发送分组消息延时比较大，所以尽量不要用
function sendMessageToMultiple(message, receivers) {
  return api.promisify('massSendText')(message, receivers);
}

function getGroupId(receiver) {
  return api.promisify('getWhichGroup')(receiver);
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


