---
layout: post
title: "Kindle Paperwhite越狱和安装KOReader"
date: 2013-06-20 00:42
comments: true
categories: 
---
> 亚马逊中国的kindle paperwhite开卖了，与之前坊间谣传的500块的价格相比，849元真的很不给力。正好碰上有个朋友去日本，托人捎了台过来，￥7980，是日元，折合人民币550左右。kindle paperwhite的屏幕已经比较细腻了，翻页时屏幕依然闪烁，电子墨水的通病。但是这个版本的kindle已经内置了光源，一个非常人性化的功能，这么多年以后才加有，不知道亚马逊怎么想的。亚马逊的用户体验那个差呀，不知道是不是老外的思维和我们不一样，反正个人觉得京东和淘宝的页面看上去要顺眼得多。

Kindle支持阅读PDF文档，只是效果不怎么好，特别显示扫描版本时。Kindle PaperWhite可以安装第三方的KOReader阅读器改进PDF文档的阅读体验，KOReader支持多种电子书格式，包括DJVU，FB2，EPUB，TXT，CBZ，HTML。在PDF显示方面KOreader得益于开源项目[K2pdfopt](http://www.willus.com/k2pdfopt/)。

K2pdfopt也是为了解决PDF文档在小屏幕Kindle上阅读的排版问题而开发的。与其它PDF预处理软件相比，它有很多独一无二的特性，比如自动化程度很高，能够自动识别多栏排版的文档进行分栏，自动去除页面白边，自动对扫描文档进行水平校正，以及最重要的基于图像分割的重排版算法。

K2pdfopt使用完全基于图像处理的方法对文字重新排版，软件处理时会把原始PDF/DJVU页面放大再分割成以词为单位的像素区域，把这些像素区域重新排列到目标宽度的页面中，所以理论上只要能够读取文档的页面像素就可以对其中的文字进行重新排版。这个算法的前提是页面中的文字之间需要有一定的空隙，以提供分割像素区域的位点。

K2pdfopt被移植到Koreader/Kindlepdfviewer以后就可以在阅读时让PDF重新排版。实时重排可以省去电脑上处理PDF的步骤，并且可以在kindle上交互式地微调排版参数，尽可能地生成满意的排版。使用Koreader的重排模式阅读时，软件会自动把当前页和下一页重排版成适应屏幕的尺寸。

安装KOrader需要先越狱，然后安装KPVBooklet。具体步骤如下

<!-- more -->

###Kindle越狱
Kindle Paperwhite Jailbreak (5.2.0 - 5.3.1,5.3.4,5.3.5)（paperwhite越狱工具不支持5.3.3和5.3.6版本，这些版本的固件需要先进行降级，然后越狱）

**如何参看Kindle系统的版本**   
从主页-> 按“菜单”键 -> 然后再按“设置” -> 在设置界面再按“菜单”键 -> 按“设备信息”
![设备信息](/images/post/2013-06-20/device-info.jpg)

越狱步骤如下：

1. 用数据线将Kindle连接到电脑上

2. 下载[kpw_jb.zip](http://www.mobileread.com/forums/attachment.php?attachmentid=103175&d=1363715068)文件。（需要翻墙）
讨论原帖地址：http://www.mobileread.com/forums/showthread.php?t=198446

3. 解压下载好的kpw_jb.zip文件，然后把jailbreak.sh和MOBI8_DEBUG文件拷贝到Kindle根目录，将jailbreak.mobi拷贝到documents目录

4. 从电脑上安全移除Kindle设备，然后断开数据线

5. 你将看到一个名为“PaperWhite Jailbreak”的文档在Kindle的主页里。点击打开文档。

6. 按照提示按住kindle屏幕的左上角不动，直到画面退出桌面。

7. 回到桌面代表成功了，那本“Paperwhite Jailbreak”的书也不见了，越狱完成。（连接电脑后可以删除documents文件夹中越狱完成后留下个LOG文件，无影响）

我们进行下一步骤

###安装KPVBooklet
KPVBooklet使原生系统支持KPV的工具。

1. 前往 https://code.google.com/p/kpvbooklet-package/downloads/list 下载最新版本的kindle-kpvbooklet-0.4.8.zip

2. 解压后通过数据线将update_kpvbooklet_0.4.8_install.bin拷贝到kindle根目录，记得安全移除kindle设备和端口数据线.(另一个文件update_kpvbooklet_0.4.8_uninstall.bin用于卸载kpvbooklet此处用不到)

3. paperwhite上点击右上角菜单>设置>再点击右上角菜单> 更新您的kindle，一阵读条等待后完成

终于可以安装KOReader了


###安装KOReader
KOReader是kindlepdfviewer（KPV）的延续版本，安装方法非常简单，前往https://code.google.com/p/koreader-package/downloads/list下载最新版本koreader-v2013.03-246-gaaeb347.zip。

解压后将“extensions”，“koreader”，“launchpad”三个目录拷贝到kindle根目录即可。

KOReader至此已经安装完成，通过数据线将PDF拷贝到documents目录，然后在kindle的里打开该文件就可以了。pdf的默认阅读器已经是KOReader了。如果希望使用kindle的原生阅读器看pdf文件，可以长按pdf文件，在弹出菜单里选择“前往…”。

###关于升级固件
目前最新版本的[kindle paperwhite固件](http://www.amazon.com/gp/help/customer/display.html/ref=hp_left_sib?ie=UTF8&nodeId=201064850)版本为5.3.6。

将update_kindle_5.3.6.bin放置到根目录然后在设备里点击升级即可。

升级完成以后，需要重新安装[Kindlet developer certificates](http://www.mobileread.com/forums/showthread.php?t=152294)和[Rescue Pack](http://www.mobileread.com/forums/showthread.php?p=2290044)以恢复越狱效果。

升级后KOReader会失效，重装一遍KPVBooklet即可。

###参考资料

[1]. [【越狱，KPV】kindle paperwhite越狱安装KPV教程](http://www.douban.com/group/topic/36613341/)   
[2]. [让Kindle支持扫描版PDF重排](http://vislab.bjmu.edu.cn/blog/hwangxin/2012/10/read-scanned-pdfs-with-kindlepdfviewer/)   
[3]. [Kindle Paperwhite Tips and Shortcuts Guide](http://blog.the-ebook-reader.com/2012/10/28/kindle-paperwhite-tips-and-shortcuts-guide/)   
[4]. [Kindle PaperWhite 45个小技巧](http://www.douban.com/group/topic/33931176/)
