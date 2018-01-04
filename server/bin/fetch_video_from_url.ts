import {fetchVideo} from '../mixin/fetch_video_from_url'
import * as path from 'path'
import * as fs from 'fs'
import * as cli from 'mora-scripts/libs/tty/cli'
import * as mkdirp from 'mora-scripts/libs/fs/mkdirp'

const download = require('download')

cli({
  usage: 'fetch_video_from_url <link>'
})
.options({
  't | title': '<string> 指定视频的标题（下载的时候有用）',
  'd | download': '<boolean> 下载解析后的视频',
  'o | outDir': '<string> 指定下载目录（ 默认是 /Users/Mora/Downloads/Videos ）'
})
.parse(async function(res) {
  if (res._.length === 0) return this.error('需要指定要解析的网页地址')
  if (res._.length > 1) return this.error('每次只支持解析一个网页地址')
  let url: string = res._[0]

  let result = await fetchVideo(url)
  if (!result) return this.error('从您提供的网页地址中解析不到视频地址')
  if (result.error) return this.error(result.error)
  let {video} = result

  let title: string = (res.title || result.title || '<无标题视频>')
  if (!(/\.\w+$/.test(title))) title += '.mp4'

  console.log(`title: ${title}`)
  console.log(`video: ${video}`)

  if (res.download) {
    let distFile = path.resolve(res.outDir || '/Users/Mora/Downloads/Videos', title)
    if (fs.existsSync(distFile)) {
      this.error(`文件 ${distFile} 已经存在了！`)
      return
    }
    mkdirp(path.dirname(distFile))
    console.log(`下载视频到目录 ${distFile} 中...`)
    download(video).pipe(fs.createWriteStream(distFile))
  }
})


