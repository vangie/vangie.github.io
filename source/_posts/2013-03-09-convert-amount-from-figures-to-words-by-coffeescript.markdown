---
layout: post
title: "Coffeescript脚本将人民币金额小写转换为大写"
date: 2013-03-09 10:43
comments: true
categories: 
---
> windows系统的搜狗输入法v模式可以很贴心地把人民币由小写转换为大写模式，Mac平台的输入法迄今还没有发现类似的功能。OSChina上看到一个哥们写了个java的版本的，于是依葫芦画瓢捣腾了个coffee的版本
<!-- more -->
```coffeescript
#! /usr/bin/env coffee

# convert amount from figures to words
# @author vangie.du
# @url http://codelife.me/blog/2013/03/09/convert-amount-from-figures-to-words-by-coffeescript/
# @version 1.1
# @since 2013-03-09

if process.argv.length >= 3
  n = parseFloat(process.argv[2]).toFixed(2)
else
	console.log "
	Usage: \n
		rmb figure_number\n
	Example:\n
		rmb 42342.33\n
		肆万贰仟叁佰肆拾贰元叁角叁分"
	process.exit(1)


fractions = ["角", "分"]
digits = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]
units = [["元", "万", "亿"],["", "拾", "佰", "仟"]]

[head, n] = if n < 0 then ['负', -n] else ['', n]

s = ''
fractionalPart = Math.round(n * 100) % 100

for i in [0..1]
	s += (digits[Math.floor(fractionalPart / Math.pow(10, 1-i)) % 10] + fractions[i])
		.replace(/(零.)+/g, "")

s = '整' unless s

intPart = Math.floor(n)

for i in [0..units[0].length - 1] when intPart > 0
	p = ''
	for j in [0..units[1].length - 1] when n > 0
		p = digits[intPart % 10] + units[1][j] + p
		intPart = Math.floor(intPart / 10)
	s = p.replace(/(零.)*零$/g, "").replace(/^$/g, "零") + units[0][i] + s

console.log(head + s.replace(/(零.)*零元/g, "元")
	.replace(/(零.)+/, "")
	.replace(/(零.)+/g, "零")
	.replace(/^整$/g, "零元整"))
```

将上面的文件保存为`~/bin/rmb`,或者其他$PATH中目录位置。

然后命令行执行

```bash
chmod + x ~/bin/rmb
rmb 42342.33
```

更进一步

```bash
ln -s ~/bin/rmb ~/bin/￥
￥ 42342.33
```


### 参考
1. [人民币小写转换为大写](http://www.oschina.net/code/snippet_32903_18900) 
