---
layout: post
title: "在iTerm2中使用Zmodem传输文件"
date: 2013-03-02 14:54
comments: true
categories: 
---
> rz,sz命令传输文件，比使用scp要方便得多，特别是在图形界面打开终端，SSH登陆到远程机器需要传输文件的时候。但是MacOS里Terminal.app并不支持Zmodel传输。好在iTerm2具备较强的扩展性可以通过简单的配置支持Zmodem传输。

###什么是Zmodem
Zmodem是针对modem的一种支持错误校验的文件传输协议。Zmodem是Ymodem的改进版，后者又是Xmodem的改进版。

<!-- more -->

####Xmodem
[Xmodem]是一个简单的文件传输协议，是由Ward Christensen于1977年为他的MODEM.ASM终端程序开发。在早期的BBS系统非常的流行。

像许多文件传输协议一样，Xmodem把文件切分成有序的数据包。并在数据包上加上一些附件的信息允许接受方确定数据包是否在传输中损坏。

##### 数据包的结构
包头：宝开始（SOH），包编号和包编号补码 

数据：固定的128字节 

包尾：校验和
##### 传输过程
XModem工作时，先由收方发出NAK，然后等待发方的包开始SOH。收到SOH后，即 将整个包收完，检查是否有错。如出错，则向发方发出一个NAK，请求发方重发； 否则发出ACK,表示接收正确，请发下个包。XModem检查包编号和checksum来确定 该包是否传送有问题。编号是发方送得出包的顺序。当XModem发送完最后一个包 时，收方会收到文件结束符(EOT)，此时，收方会送出一个ACK通知发方传送结束。

####Ymodem
[Ymodem]是Chuck Forsberg开发的Xmodem的改进版，1985年被Xmodem的开发者Ward Christensen称之为“Ymodem”。

相对于Xmodem的主要改进是在发送方发送真实数据块前，先发送一个称之为“block 0”的数据块（真实的数据块是从1开始计数），改数据块包含文件名，大小和时间戳。文件大小解决了Xmodem文件尾部剩余填充的问题。

####Zmodem
[Zmodem]是Chuck Forsberg于1986年发布的Ymodem的改进版本。关键的改进是引进了**滑动窗口协议**([Sliding window protocol])改进了传输的性能。

在Xmodem或者Ymodem传输时发送方需要等待接收方放的ACK或者NAK响应才继续发送下一个数据包。Zmodem把这个同步的确认过程改成了异步的，发送方可以不断的方式数据包，然后异步的接收ACK或者NAK包，过一段时候后再决定是否需要重新发送数据包。这种方式解决了确认包网络延迟造成对传输速率的影响。

###安装Zmodem的实现

	brew install lrzsz
	
###创建脚本

将下面两个脚本创建到`/usr/local/bin`目录

item2-send-zmodem.sh
```bash
#!/bin/bash
# Author: Matt Mastracci (matthew@mastracci.com)
# AppleScript from http://stackoverflow.com/questions/4309087/cancel-button-on-osascript-in-a-bash-script
# licensed under cc-wiki with attribution required 
# Remainder of script public domain

FILE=`osascript -e 'tell application "iTerm" to activate' -e 'tell application "iTerm" to set thefile to choose file with prompt "Choose a file to send"' -e "do shell script (\"echo \"&(quoted form of POSIX path of thefile as Unicode text)&\"\")"`
if [[ $FILE = "" ]]; then
	echo Cancelled.
	# Send ZModem cancel
	echo -e \\x18\\x18\\x18\\x18\\x18
	echo \# Cancelled transfer
	echo
else
	echo $FILE
	/usr/local/bin/sz "$FILE"
	echo \# Received $FILE
	echo
fi
```

iterm2-recv-zmodem.sh
```bash
#!/bin/bash
# Author: Matt Mastracci (matthew@mastracci.com)
# AppleScript from http://stackoverflow.com/questions/4309087/cancel-button-on-osascript-in-a-bash-script
# licensed under cc-wiki with attribution required 
# Remainder of script public domain

FILE=`osascript -e 'tell application "iTerm" to activate' -e 'tell application "iTerm" to set thefile to choose folder with prompt "Choose a folder to place received files in"' -e "do shell script (\"echo \"&(quoted form of POSIX path of thefile as Unicode text)&\"\")"`
if [[ $FILE = "" ]]; then
	echo Cancelled.
	# Send ZModem cancel
	echo -e \\x18\\x18\\x18\\x18\\x18
	echo \# Cancelled transfer
	echo
else
	echo $FILE
	cd "$FILE"
	/usr/local/bin/rz 
	echo \# Received $FILE
	echo
fi
```
###设置iTerm2
修改iTerm2的default trigger（iTerm偏好设置-> Profiles -> Default -> Advanced -> Triggers的Edit按钮

	Regular expression: \*\*B0100 
	Action: Run Silent Coprocess 
	Parameters: /usr/local/bin/iterm2-send-zmodem.sh

  
	Regular expression: \*\*B00000000000000 
	Action: Run Silent Coprocess 
	Parameters: /usr/local/bin/iterm2-recv-zmodem.sh

###发送文件到远端服务器
1. 在远端服务器执行`rz`
2. 本地选择文件传输
3. 等待传输指示消失

###接收远端服务器的文件
1. 再远端服务器执行`sz filename1 filename2 … filenameN`
2. 本地选择目录保存
3. 等待传输指示消失


[Xmodem]: http://en.wikipedia.org/wiki/XMODEM
[Ymodem]: http://en.wikipedia.org/wiki/YMODEM
[Zmodem]: http://en.wikipedia.org/wiki/ZMODEM
[Sliding window protocol]: http://en.wikipedia.org/wiki/Sliding_window


###参考文献
1. [在iTerm2中使用Zmodem的方法](http://openexz.sinaapp.com/2012/08/29/%E5%9C%A8iterm2%E4%B8%AD%E4%BD%BF%E7%94%A8zmodem%E7%9A%84%E6%96%B9%E6%B3%95/)
2. [ZModem integration for iTerm 2](https://github.com/mmastrac/iterm2-zmodem)
3. [Appendix H. Zmodem File Transfer](http://docstore.mik.ua/orelly/linux/run/apph_01.htm)