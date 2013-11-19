---
layout: post
title: "MacOS X终端里SSH会话管理"
date: 2012-09-01 23:31
comments: true
categories: 
---
>本文介绍如何在终端里使用ssh命令方便的管理常用的ssh访问会话，主要针对MacOS X系统编纂，并在Mountain Lion下测试通过。但是同样适用与安装有Bash终端的*uix系统。

虽然windows没有对SSH的原生支持，但是[XShell](http://www.netsarang.com/products/xsh_overview.html)和[Putty]都挺好用的。日常工作需要维护多台linux服务器，用户名和密码多了记不住，所有非常依赖会话记忆功能。

<!-- more -->

在Mac平台没有找到合适的与[Putty]功能类似的软件。可能由于*nix系的操作系统对SSH原生支持，开发者也就没有兴趣去折腾桌面软件，当然也可能是有好的，只是没有找到。

在Terminal里使用SSH便捷登录需要解决三个问题

* 免密码
* 别名快捷登录
* 自动补全

## 免密码

SSH有两种验证方式：密码和非对称密钥。虽然相比密码来说，非对称密钥的安全性会低一些_（某用户拥有你本地root权限，可能就可以操作你的远程服务器，当然密钥本身也设置有密码）_，但是这种与系统绑定的信任机制给无人值守的远程拷贝和系统备份提高了便利。

配置步骤如下：

1.	**创建密钥对**

	开启终端并执行

		ssh-keygen -t rsa
			
	依照提示完成即可，然后将`id_rsa`和`id_rsa.pub`文件拷贝到`~/.ssh/`目录。	
		
2.	**拷贝公钥到远程服务器**

	需要将公钥`id_rsa.pub`的内容拷贝到远程服务器`~/.ssh/authorized_keys`文件里。该文件里可能不存在，需要新建。若该文件已经存在，里面可能有其他用户添加的公钥，所以需要将公钥`id_rsa.pub`的内容追加在文件尾部(独立成行)，而不是覆盖该文件.
	* 	若`authorized_keys`已存在
	
			cat ~/.ssh/id_rsa.pub | ssh username@example.com "cat - >> ~/.ssh/authorized_keys"		
	
	*	若`authorized_keys`不存在
	
			scp ~/.ssh/id_rsa.pub username@example.com:~/.ssh/authorized_keys
	
	* **更好的方式**（无论`authorized_keys`在与不在）
	
			ssh-copy-id username@example.com
			
3. [可选] **提高系统安全性**

		chmod 0600 ~/.ssh/authorized_keys

4. **[注意]**如果系统开启的SELinux，完成上述配置以后仍然会提速输入密码，需要执行如下命令

		restorecon -R -v /root/.ssh

## 别名快捷登录

SSH可以在`/etc/ssh_config`或者`~/.ssh/config`文件里给远程连接主机配置别名。相当与Putty里的会话管理。

在`~/.ssh/config`里添加如下配置

	Host dv
		HostName example.com
		User domainuser

然后在终端里执行`ssh dv`，就相当于`ssh domainuser@example.com`

至此，已经可以在命令行里实现类似[Putty]里免密码快捷登录了。但是随着`~/.ssh/config`里服务器别名项的增多，或者某些服务器长期不用，别名记不起来了。当然使用`cat`和`grep`命令可以轻松搞定。如果`ssh`命令能如`ls`命令有自动补全就好了。这个真可以有。

## 自动补全

往`~/.bash_profile`文件末尾追加如下行
	
	complete -W "$(echo `cat ~/.ssh/config | grep 'Host '| cut -f 2 -d ' '|uniq`;)" ssh
	
重启终端，`ssh + TAB`是不是很酷。


#### 参考文献
1.	[SSH login without password using OS X](http://smbjorklund.no/ssh-login-without-password-using-os-x)
2.	[Creating SSH Shortcuts Using SSH Config](http://ccn.ucla.edu/wiki/index.php/Creating_SSH_Shortcuts_Using_SSH_Config)
3.	[ssh autocomplete](http://www.commandlinefu.com/commands/view/2759/ssh-autocomplete)
4.	[PASSWORDLESS ROOT SSH PUBLIC KEY AUTHENTICATION ON CENTOS 6](http://blog.firedaemon.com/2011/07/27/passwordless-root-ssh-public-key-authentication-on-centos-6/)

[Putty]: http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html "Putty"