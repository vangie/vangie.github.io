---
layout: post
title: "让Mac正确的识别Noppoo Chic Mini84"
date: 2013-11-13 14:44
comments: true
categories: 
---
>半年前入了一把Noppoo的84键茶轴机械键盘，这把键盘的手感真心不错，也非常的小巧，很短，放在桌上也一点都不占位置。唯一的缺点就是不支持Mac系统。官方未提供mac版本的驱动程序，在mac系统下有部分键不好用。网上倒是提供了两种解决方案：一种是usb转ps2，再ps2转usb两次转换以后就好用了（依靠转换器里的芯片）；另一个种是安装Github上的[第三方驱动](https://github.com/thefloweringash/iousbhiddriver-descriptor-override)。

![Noppoo Chic Mini84](/images/post/2013-11-13/noppoo-chic-mini84.jpg)

两种方法都有试过，两次转换可以免去装驱动的麻烦，但是由于接了两个转换器，有时候会接触不好。最后选用了加装驱动的方案。

<!-- more -->

###加装驱动

* pkg安装包 https://thefloweringash.com/iousbhiddriver-descriptor-override/downloads/IOUSBHIDDriverDescriptorOverride-2013-04-21-b545d15.pkg

* 编译安装

	1. 下载源码 https://github.com/thefloweringash/iousbhiddriver-descriptor-override/archive/master.zip
	2. 编译
```
# dependencies
gem install bundler
bundle install --without scan

# build
xcodebuild
sudo cp -r build/Release/IOUSBHIDDriverDescriptorOverride.kext \
    /System/Library/Extensions
sudo kextutil \
    /System/Library/Extensions/IOUSBHIDDriverDescriptorOverride.kext
```
	3. 启动时加载，把com.apple.IOUSBHIDDriverDescriptorOverride.plist复制到/Library/LaunchDaemons/下面
```
launchctl load -w /Library/LaunchDaemons/com.apple.IOUSBHIDDriverDescriptorOverride.plist
launchctl list | grep om.apple.IOUSBHIDDriverDescriptorOverride
```

### 安装KeyRemap4MacBook

下载地址 https://pqrs.org/macosx/keyremap4macbook/


### 参考阅读

1. [Noppoo Chic Mini 84支持Mac OS X](http://likidu.com/noppoo-chic-mini84-osx-support/)