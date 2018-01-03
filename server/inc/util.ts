import * as util from 'util'
import * as base64 from 'base-64'

export function error(msg: any, ...args: any[]) {
  console.error('\x1b[31m' + util.format(msg, ...args) + '\x1b[0m')
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export {
  base64
}
