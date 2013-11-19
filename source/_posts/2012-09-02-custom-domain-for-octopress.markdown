---
layout: post
title: "为Octopress博客设置个性化域名"
date: 2012-09-02 20:31
comments: true
categories: 
---
其实挺简单的，官方文档也写的很清晰，不过还是碰到了让人受挫的404错误。

##添加CNAME文件

	echo 'your-domain.com' >> source/CNAME
	
<!-- more -->

##修改DNS记录	
然后去域名注册商那里配置DNS记录（本站域名在godaddy注册的，NS记录指向了[DNSPod]，国内用户强烈推荐[DNSPod]，配置方便，记录变更生效快）。

####顶级域名
A记录指向 `204.232.175.78`
####二级域名
CNAME记录指向 `[your-username].github.com`
####若配置多个域名
`source/CNAME`文件只能有配置一个域名，其他域名通过DNS的CNAME记录指向`source/CNAME`里配置的域名

##重新发布
接下来就只需要重新发布一下

	rake generate
	rake deploy
	
>别忘了`rake generate`否则使用新域名打开页面可能就会遇上404错误。

###参考文献
1. [Deploying to Github Pages](http://octopress.org/docs/deploying/github/)
2. [My custom domain isn't working](https://help.github.com/articles/my-custom-domain-isn-t-working)

[DNSPod]: https://www.dnspod.cn/ "DNSPod"