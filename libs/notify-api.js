require('dotenv').config({silent: true});

const env = process.env;

const me = 'oHwgPv42MXp8ckI4GsW3VyN8AFNY';

const WechatAPI = require('wechat-api');
const api = new WechatAPI(env.TEST_WECHAT_APP_ID, env.TEST_WECHAT_APP_SECRET);

function send(message, shouldReportError = false) {
  api.sendText(me, message, (err, body, xhr) => {
    if (err && shouldReportError) sendError({err, body});
  });
}

function sendError(any) {
  api.sendText(me, 'Error: ' + JSON.stringify(any));
}

module.exports = {
  api,
  send,
  sendError
};
