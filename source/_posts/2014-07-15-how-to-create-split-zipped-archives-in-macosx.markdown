---
layout: post
title: "Mac OS X下如何分卷压缩"
date: 2014-07-15 21:22:06 +0800
comments: true
categories: 
---
> 一朋友的公司邮箱只能接受5M的附件，还世界500强企业真心落后。无奈只能分卷压缩大文件，Mac OS X下没有盗版的WinRar可用，所以只好采用ZIP格式分卷了

###创建分卷压缩文件

####将目录分卷压缩

    zip -s 100m -x "*.DS_Store" -r split-foo.zip foo/

* `-s` 切分单元的大小，可选的单位有k(kB), m(MB), g(GB), t(TB),默认为m
* `-r` 或者 `--recurse-paths` 递归目录
* `-x` 或者 `--exclude` 忽略文件

####切分已有zip文件

    zip existing.zip --out new.zip -s 50m

将创建

>new.zip   
>new.z01     
>new.z02   
>new.z03   
>...

<!-- more -->

###解压分卷压缩文件

还原分为两步

1.将切分文件合并成单一zip文件

    zip -s 0 split.zip --out single.zip

* `-s 0` 表示合并

2.解压

    unzip single.zip 

### 参考文献
1. [How do I split a .zip file into multiple segments?](http://superuser.com/questions/336219/how-do-i-split-a-zip-file-into-multiple-segments)
2. [How To Create A Split Zipped Archive From Mac OS X Terminal](http://www.addictivetips.com/mac-os/how-to-create-a-split-zipped-archive-from-mac-os-x-terminal/)
3. [How can I compress a folder into multiple zip files?](http://apple.stackexchange.com/questions/12371/how-can-i-compress-a-folder-into-multiple-zip-files)
4. [Mac OS X: create/extract split zip archives](http://notepad2.blogspot.jp/2012/12/mac-os-x-createextract-split-zip.html)





