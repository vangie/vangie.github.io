---
layout: post
title: "Mac OS X替换Razer的状态栏图标"
date: 2013-11-16 01:37
comments: true
categories: 
---
> 心爱的QeathAdder炼狱蝰蛇变形金刚款，用了300多天左键坏了，联系易迅给换了个QeathAdder炼狱蝰蛇2013款。虽然黑色的外观不如变形金刚款银色的配MacBook，但是6400dpi的分辨率，着实给力。CS:GO的甩狙命中率显著提升，开始以为年纪大了水平下降了，换鼠标后，发现还是鼠标的问题。话说Razer鼠标的管理界面支持登录以后保存鼠标配置的功能很好，就是状态栏的蓝色图标和Mac OS统一的暗灰色图标比起来太不协调了。

默认效果

![](/images/post/2013-11-16/replace_before.png)

替换后的效果

![](/images/post/2013-11-16/replace_after.png)

替换图标

![](/images/post/2013-11-16/Status.png)

###替换图标

1. 在Finder里找到`/Library/Application Support/Razer/RzUpdater.app`
Command+Shift+G打开GO to对话框，输入`/Library/Application Support/Razer`
2. 右键RzUpdater.app显示包内容
3. 然后再进入`Contents/Resources`目录
4. 用上面的图标替换Status.png文件即可。
5. 重启系统或者杀掉RzUpdater进程


###参考阅读

1. [Razer DeathAdder Icon in Menubar (Synapse 2.0)](http://forums.macrumors.com/showthread.php?t=1432198)