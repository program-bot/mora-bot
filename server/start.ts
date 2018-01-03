import * as express from 'express'
import fetch_video_from_url from './mixin/fetch_video_from_url'

require('dotenv').config({silent: true})
const env = process.env
const wechat = require('wechat')

// https://mora-bot.herokuapp.com/wechat
// test account: http://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
const wechatConfig = {
  token: env.WECHAT_TOKEN,
  appid: env.WECHAT_APP_ID,
  encodingAESKey: env.WECHAT_ENCODING_AES_KEY
}
const wechatTestConfig = Object.assign({}, wechatConfig, {
  appid: env.TEST_WECHAT_APP_ID
})

let app = express()

app.use('/wechat', wechat(wechatConfig, (req: any, res: any, next: any) => {
  console.log('/wechat:', req.weixin)
  parse(req, res, next)
}))

// https://mora-bot.herokuapp.com/wechat-test
app.use('/wechat-test', wechat(wechatTestConfig, (req: any, res: any, next: any) => {
  console.log('/wechat-test:', req.weixin)
  parse(req, res, next)
}))

const port = env.PORT || 5000
const host = '0.0.0.0'
app.listen(port, host, () => console.log(`Server on http://${host}:${port}`))

async function parse(req: any, res: any, next: any) {
  let message = req.weixin
  try {
    if (!(await fetch_video_from_url(message, res))) {
      res.reply('暂时无法解析您提供的内容!')
    }
  } catch (e) {
    console.error(e)
    res.reply('系统错误：' + e.message)
  }
}

