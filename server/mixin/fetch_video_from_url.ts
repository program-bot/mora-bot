import {Message, ITextMessage, ILinkMessage} from '../inc/interface'
import {base64} from '../inc/util'
import * as puppeteer from 'puppeteer'

export default async function(message: Message, res: any): Promise<boolean> {

  let result: IFetchVideoFromUrlResult = null
  let url: string | undefined

  if (message.MsgType === 'text') {
    let content = (message as ITextMessage).Content
    if (/^https?:\/\//.test(content)) {
      url = content
    }
  } else if (message.MsgType === 'link') {
    url = (message as ILinkMessage).Url
  }

  if (url) result = await fetchVideo(url)

  if (!result) return false
  if (result.error) {
    res.reply(result.error)
  } else if (result.video) {
    res.reply(`${result.title} ${result.video}`)
  }
  return true
}

export async function fetchVideo(url: string): Promise<IFetchVideoFromUrlResult> {
  const browser = await puppeteer.launch({
    // https://github.com/program-bot/puppeteer-heroku-buildpack#puppeteer-heroku-buildpack
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  // console.log(browser.wsEndpoint())
  const page = await browser.newPage()
  // await page.setRequestInterception(true)

  let video: string | undefined
  let error: string | undefined
  let title: string | undefined

  page.on('response', async (response) => {
    if (response.status !== 200) return
    let {url} = response

    /* 获取头条视频 mp4 的 url 地址 */
    if (url.startsWith('https://ib.365yg.com/video/urls/v/1/toutiao/mp4/')) {
      // text 是个 jsonp
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
        }
      }
    }
  })

  await page.goto(url)
  if (video) title = await page.title()
  await browser.close()
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
