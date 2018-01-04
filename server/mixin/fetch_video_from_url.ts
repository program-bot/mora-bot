import {Message, ITextMessage, ILinkMessage} from '../inc/interface'
import {base64, sleep} from '../inc/util'
import * as puppeteer from 'puppeteer'
import * as debug from 'debug'

const devices = require('puppeteer/DeviceDescriptors')
const bot = require('../../libs/wechat-bot')
const log = debug('fetch:video')

const iPhone6S = devices['iPhone 6 Plus']

/**
 * 服务器长时间没返回信息时，微信会连续推三条一样的信息给服务器，
 * 三条后还是没返回，微信会关闭 socket，也就会导致服务器无法返回信息，
 * 但可以使用消息推送，而不是 response
 */
export default async function(message: Message, res: any): Promise<boolean> {
  let url: string | undefined
  if (message.MsgType === 'text') {
    let content = (message as ITextMessage).Content
    if (/(https?:\/\/[^\s]+)/.test(content)) url = RegExp.$1
  } else if (message.MsgType === 'link') {
    url = (message as ILinkMessage).Url
  }

  if (url) {
    res.reply(`正在解析 ${url} 中的视频，请稍候...`)
    fetchVideoTo(url, (text: string) => {
      log(`===> 返回结果: ${text}`)
      bot.promisify('sendText')(message.FromUserName, text)
        .catch((e: any) => {
          log('微信接口 sendText 发送消息失败')
          log(e)
        })
    })
    return true
  }

  return false
}

async function fetchVideoTo(url: string, send: (text: string) => void) {
  try {
    let result: IFetchVideoFromUrlResult = await fetchVideo(url)

    if (!result) {
      send('无法获取任何视频地址')
    } else if (result.error) {
      send(result.error)
    } else if (result.video) {
      send(`${result.title}\n${result.video}`)
    }
  } catch (e) {
    send('系统错误 ' + e.message)
    log(e)
  }
}


/**
 * 今日头条（西瓜视频）：  https://www.ixigua.com/i6502213040778248717
 * 火山小视频：          https://reflow.huoshan.com/share/item/6498845794311867662/
 * 抖音：               https://www.douyin.com/share/video/6433255077565172994/
 * 快手：               https://m.kuaishou.com/photo/257290945/4463112708
 */
export async function fetchVideo(url: string, title?: string): Promise<IFetchVideoFromUrlResult> {
  log('打开浏览器...')
  const browser = await puppeteer.launch({
    // executablePath: '/Applications/Chrome.app/Contents/MacOS/Google Chrome',
    // executablePath: '/Applications/Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    executablePath: process.env.GOOGLE_CHROME_BIN,
    headless: true,
    // devtools: true,
    // https://github.com/program-bot/puppeteer-heroku-buildpack#puppeteer-heroku-buildpack
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  log('新建页面...')
  const page = await browser.newPage()
  await page.emulate(iPhone6S)
  // await page.setRequestInterception(true)

  let video: string | undefined
  let error: string | undefined

  page.on('response', async (response) => {
    let {url} = response
    // console.log(response.headers['content-type'])

    // 注意：chromium 不支持 mp4 格式
    // video 在预加载的时候状态码是 206
    // https://github.com/GoogleChrome/puppeteer/issues/291
    if (response.headers['content-type'].startsWith('video/') && !video) video = url
    if (response.status !== 200) return

    /* 获取头条视频 mp4 的 url 地址 */
    if (url.startsWith('https://ib.365yg.com/video/urls/v/1/toutiao/mp4/')) {
      // text 是个 jsonp
      log(`解析到头条的视频信息地址 ${url}，开始获取其内容...`)
      let text = await response.text()
      if (/^\w+\((.*)\)$/.test(text)) {
        let res: ITaotiaoVideoInfoData = JSON.parse(RegExp.$1)
        if (res.code !== 0) {
          error = '头条返回的 code 不为 0：' + text
        } else {
          let all = res.data.video_list
          let max: any = null
          Object.keys(all).forEach(key => {
            if (!max) max = all[key]
            else if (parseInt(max.definition, 10) < parseInt(all[key].definition, 10)) max = all[key]
          })
          video = base64.decode(max.main_url)
          log(`===> 视频地址为 ${video}`)
        }
      }
    }
  })

  log(`跳转到地址 ${url} ...`)
  await page.goto(url, {waitUntil: 'networkidle2'})
  if (!video) {
    log(`等待 2s...`)
    await sleep(2000) // 等待页面自动去加载视频
  }

  if (video && !title) {
    log(`获取页面标题...`)
    title = await page.title()
    log(`===> 页面标题为 ${title}`)
  }

  // if (!video) {
  //   log(`screenshot ...`)
  //   await page.screenshot({
  //     fullPage: true,
  //     path: '/Users/Mora/Workspace/node/program-bot/mora-bot/screen.png'
  //   })
  // }

  log(`关闭浏览器...`)
  await browser.close()
  log(`===> 浏览器关闭成功！`)
  return (video || error) ? {video, error, title} : null
}


type IFetchVideoFromUrlResult = {error: string | undefined, video: string | undefined, title: string | undefined} | null

interface ITaotiaoVideoInfoData {
  data: {
    video_id: string
    poster_url: string
    video_duration: number
    auto_definition: string
    video_list: {
      [key: string]: {
        definition: string
        vtype: string
        vwidth: number
        vheight: number
        bitrate: number
        size: number
        codec_type: string
        file_hash: string
        main_url: string
        backup_url_1: string
      }
    }
  }
  message: string
  code: number
}
