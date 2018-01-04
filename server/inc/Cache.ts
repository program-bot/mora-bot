let Cache: any = require('memjs').Client.create()

export default {
  async get<T>(key: string): Promise<T | null> {
    let res = await Cache.get(key)
    if (res.value === null) return null
    return JSON.parse(res.value.toString())
  },

  set(key: string, val: any): Promise<void> {
    return Cache.set(key, JSON.stringify(val), {})
  }
}
