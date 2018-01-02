import {fetchVideo} from '../mixin/fetch_video_from_url'
import * as cli from 'mora-scripts/libs/tty/cli'

cli({
  usage: 'fetch_video_from_url <link>'
})
.parse(async function(res) {
  if (res._.length === 0) return this.error('需要指定要解析的网页地址')
  if (res._.length > 1) return this.error('每次只支持解析一个网页地址')
  let url: string = res._[0]

  let result = await fetchVideo(url)
  if (!result) return this.error('从您提供的网页地址中解析不到视频地址')
  if (result.error) return this.error(result.error)
  console.log(`title: ${result.title}`)
  console.log(`video: ${result.video}`)
})


