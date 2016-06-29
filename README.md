# mora-bot

[![NPM version](https://badge.fury.io/js/mora-bot.svg)](https://npmjs.org/package/mora-bot)
[![Build Status](https://travis-ci.org/program-bot/mora-bot.svg?branch=master)](https://travis-ci.org/program-bot/mora-bot)


[参考文章](http://zeke.sikelianos.com/npm-and-github-automation-with-heroku/) [本地备份](./res/npm-and-github-automation-with-heroku.html)

参考项目：

* https://npms.io/ 非常值得研究下
* http://node-modules.com/
* https://github.com/zeke/all-the-package-names
* https://github.com/solids/npmsearch
* https://github.com/anvaka/npmrank
* https://github.com/corruptmem/nodejsmodules
* https://github.com/anvaka/pm
* https://github.com/nodezoo/nodezoo-workshop
* https://github.com/npm/npm-registry-couchapp

## 获取 npm 官方数据

```
https://skimdb.npmjs.com/registry/_design/scratch/_view/byField?limit=5&skip=1000
```


## heroku scripts

```
heroku run "npm run release"

heroku logs --tail
```

## 目录说明

* build:    存放生成的文件
* data:     存放网上下载的一些数据
* libs:     一些脚本依赖的库
* res:      其它资源
* scripts:  对应 npm 的 package.json 文件中的 scripts

