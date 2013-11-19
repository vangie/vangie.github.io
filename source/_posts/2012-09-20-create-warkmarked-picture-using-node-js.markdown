---
layout: post
title: "NodeJs里给图片添加水印"
date: 2012-09-20 00:44
comments: true
categories: 
---
[ImageMagick]和[GraphicsMagick]是两款强大的跨平台图片命令行工具,据说[GraphicsMagick]是从[ImageMagick]分支出来的,更稳定些.

Java平台图片处理包[im4java](http://im4java.sourceforge.net/)使用JNI的方式封装了[ImageMagick].NodeJs平台图片处理模块[gm]只需要[GraphicsMagick]和[ImageMagick]任选一种安装就好了.

<!-- more -->

使用[gm]进行图片处理非常之方便

``` javascript
var gm = require('gm');

gm('/path/to/image.jpg')
.resize(353, 257)
.autoOrient()
.write(writeStream, function (err) {
  if (!err) console.log(' hooray! ');
});
```

但在Mac平台安装有些麻烦,由于[GraphicsMagick]使用了linux的图形库,所以需要先安装[XQuartz](http://xquartz.macosforge.org/),最新版本已经支持Mountain Lion了.

[GraphicsMagick]可以通过homebrew安装

```bash
brew install graphicsmagick
```

装[gm]就不多说了`npm install gm`

[gm]目前只封装了[GraphicsMagick]的`convert`子命令,添加水印需要的用到`composite`子命令.所以只能采用下策:直接调用[GraphicsMagick]命令行接口

```javascript
var spawn = require('child_process').spawn;

var composite = spawn('gm',
	[
		'composite',
		'-gravity',
		'SouthEast', //右下角
		'-dissolve',
		'80', //溶解度,和透明度类似
		'watermark.png',
		'src.jpg',
		'dest.jpg'
	]);

composite.stdout.on('data',function(data){
	console.log(data);
});

composite.stderr.on('data',function(data){
	console.log(data);
});

composite.on('exit',function(code){
	if(code != 0){
		console.log('gm composite process exited with code ' + code);
	}
});
```


[ImageMagick]: http://imagemagick.org/
[GraphicsMagick]: http://www.graphicsmagick.org/
[gm]:http://aheckmann.github.com/gm/