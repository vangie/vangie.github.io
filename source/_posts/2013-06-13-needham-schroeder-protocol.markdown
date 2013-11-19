---
layout: post
title: "Needham-Schroeder协议"
date: 2013-06-13 22:23
comments: true
categories: 
---
> 最近学习了一些账户登录和验证相关的知识，了解了OpenId机制的一些技术细节，发现OpenId的验证机制和某些基于Web的SSO验证机制非常类似，但不知道这些验证机制的原型和出处，于是开始转向学习Kerberos - Unix平台上一个老牌的单点登录验证系统。在《Kerberos权威指南》里找到了“Needham-Schroeder协议”,虽然不知道这个协议与其后出现的Web SSO和OpenId有没有渊源，但是学习这个协议对于理解SSO非常有帮助。

###借助受信任的第三方相互验证

《在大型计算机网络中使用加密身份验证》是Roger Needham和Michael Schroeder 1978年在施乐帕罗奥多研究中心（当年乔布斯偷师的地方）工作时发表的一篇论文。该论文讨论了在非安全网络环境下，通讯双方如果借助一个共同信任的第三方相互验证的方法。

协议假设有三方参与，一个客户机，一个应用服务器和一个验证服务器。客户机可以是某台请求验证的机器，通常是个人电脑。服务器提供客户机希望访问的服务，比如邮件服务。而验证服务器是一台专门的服务器，用于存储网络上用户和服务器的密钥（受信任的第三方）。

<!-- more -->

###协议的两个版本

* **基于对称密钥算法的Needham-Schroeder协议**。Kerberos单点认证系统基于此协议扩展，该协议旨在双方之间在网络上建立会话密钥，以保护之后的通讯。
* **基于非对称密钥算法的Needham-Schroeder协议**。该协议的目的是提供在网络上通信的双方之间的相互认证，但其建议的形式是不安全的。

下面采用安全协议标记法(security protocal notation) 来表示两种不同版本的Needham-Schroeder协议

###对称密钥版本
假设，Alice（简称A）发起向Bob（简称B）的通信。Server（简称S）一个被双方信任的服务器。   


在通信中：
   
* A和B分别是Alice和Bob的身份标识
* K<sub>AS</sub>是A和S的对称密钥
* K<sub>BS</sub>是B和S的对称密钥
* N<sub>A</sub>和N<sub>B</sub>分别是A和B生成的随机数nonces   
* K<sub>AB</sub>是一个生成的对称密钥，将用于A和B之间的会话的会话密钥。   

步骤如下：      
1. Alice向服务器发送一条包含她本人和Bob标识的消息，告诉服务器她想和Bob通信。   
 ![](http://upload.wikimedia.org/math/1/b/5/1b53543c28f72a2151812f45874f7deb.png)   
2. 该服务器产生K<sub>AB</sub>,并发送回Alice一个副本和一个被K<sub>BS</sub>加密的副本由Alice转交给Bob。由于Alice可能同时发出多份通信验证请求，所有nonce保证响应消息是新的和并与某一请求对应。在响应中加入了Bob的标识以告诉Alice她将与谁共享该密钥。    

 ![](http://upload.wikimedia.org/math/6/5/a/65a61e0dc01947d23a57e0ce931977cf.png)   
3. Alice将K<sub>AB</sub>密钥转交给Bob，他能通过K<sub>BS</sub>密钥（他于服务器的共享密钥）解密出该密钥，以验证数据的可靠性。
   
 ![](http://upload.wikimedia.org/math/2/f/1/2f163c6bc7957588abe99f9fa115740e.png)   
4. 然后Bob想Alice发送一个通过密钥K<sub>AB</sub>随机数nonce，表示他以获得密钥
   
 ![](http://upload.wikimedia.org/math/3/b/d/3bdb6789891493725b8ebe8e6894f0fd.png)   
5. Alice对接收到的随机数nonce进行简单的操作，重新进行加密，并把它发送回确认她也持有密钥并且仍处于活跃状态。   

 ![](http://upload.wikimedia.org/math/e/2/7/e27ecba9e6a2499a8350be598e9ce40b.png)   
	
####攻击该协议
该协议可被回放攻击。如果攻击者使用一个陈旧的被窃取的K<sub>AB</sub>，他可以回放{K<sub>AB</sub>, A}<sub>K<sub>BS</sub></sub>给Blob，Blob不但不知道这个密钥是已过期，反而欣然接收请求。

####改进版本

Kerberos协议通过加入时间戳改进了这一缺陷。也可以引入随机数nonce。

1. Alice向Bob发起请求

	![](http://upload.wikimedia.org/math/d/e/6/de6d2884e31e5dd8a56cdbecd0379bb9.png)
2.	Bob响应她一个随机数nonce，该随机数被bob和认证服务器的对称密钥加密

	![](http://upload.wikimedia.org/math/e/3/e/e3ecf601c90b6ef52cbd3f3571320c97.png)
3.	Alice发送一个消息给服务器包含自己和鲍勃的标识，告知她想要与Bob通信服务器。

	![](http://upload.wikimedia.org/math/8/b/4/8b497cd33ae923645067291a7891cb2a.png)
4. 注意包含的随机数

	![](http://upload.wikimedia.org/math/0/6/c/06c9c78b9f91526228116cc30ac66bfc.png)

接下来的3步与上面协议描述的类似。注意N'<sub>B</sub>不同于N<sub>B</sub>。新包含的随机数可以防止回放被窃取的{K<sub>AB</sub>, A}<sub>K<sub>BS</sub></sub>,由于新的消息格式为{K<sub>AB</sub>, A, N'<sub>B</sub>}<sub>K<sub>BS</sub></sub>,攻击者无法伪造，因为他得不到K<sub>BS</sub>密钥。

###非对称密钥版本
该版本使用了公钥加密算法
假设，Alice（简称A）和Bob（简称B）都使用信任的服务器（简称S）发布的公钥用于请求。
这些密钥是：  
 
* K<sub>PA</sub>和K<sub>SA</sub>，分别表示A的公钥和私钥对。其中（S表示“Secret Key”）
* K<sub>PB</sub>和K<sub>SB</sub>，是B的密钥对。
* K<sub>PS</sub>和K<sub>SS</sub>，是S的密钥对。

协议的步骤是：

1. A向S请求B的公钥

	![](http://upload.wikimedia.org/math/5/7/2/57211ef0e2f43a95e8346290887e8da3.png)
2. S响应B的标识和公钥，并使用自己的私钥加密数据，以便A验证自己。

	![](http://upload.wikimedia.org/math/5/5/5/5556de3bf2768c8b3dd97e99cde6fe4c.png)
	3. A引入随机数N<sub>A</sub>,然后发送给B

	![](http://upload.wikimedia.org/math/c/6/0/c60110a492a0096f31fa91b8ece8d4a6.png)
4. B向S请求A的公钥

	![](http://upload.wikimedia.org/math/e/6/b/e6bd04eb3d4a5f2462b9642954955443.png)
5. S的响应

	![](http://upload.wikimedia.org/math/b/3/1/b31c9fc795a424d490ca573f2aedd7ec.png)
6. B引入随机数N<sub>B</sub>和N<sub>A</sub>使用K<sub>PA</sub>加密后发送给A，以证明他的能力。

	![](http://upload.wikimedia.org/math/3/3/5/33583fcf1b33ad5e83c914ef6c529530.png)
7. A发回确认请求包含N<sub>B</sub>，以证明他能使用K<sub>SA</sub>解密

	![](http://upload.wikimedia.org/math/3/1/e/31e07ae0859dd58e24473fc5c720531b.png)
	
最后，A和B双方相互确认，也都知道随机数N<sub>A</sub>和N<sub>B</sub>。这些随机数不为窃听者所知。

####攻击该协议
遗憾的是，该协议可被中间人攻击。如果一个骗子能说服A向他发起会话，然后他将消息传输给B，让B误以为在与A进行通信。

下面攻击的过程忽略了与S的通信，因为没有差异：

1. A向I发送N<sub>A</sub>，使用I的公钥K<sub>SI</sub>

	![](http://upload.wikimedia.org/math/a/d/b/adbe524547c2d654be815394f719404f.png)
2. I将消息转发给B，假装A在于他进行通信

	![](http://upload.wikimedia.org/math/e/b/1/eb11f142798ea5b44a5bd5a93165ac98.png)
3. B发回B<sub>N</sub>

	![](http://upload.wikimedia.org/math/c/d/3/cd3499b767d1e4a062fb2615e8b0d48d.png)
4. I转发给A

	![](http://upload.wikimedia.org/math/f/7/a/f7a0bee8365d9378cac7774608f2d0d8.png)
5. 加密的B<sub>N</sub>被发回，向I确认。

	![](http://upload.wikimedia.org/math/3/c/e/3ce745fbe7e751c6d3f8442fecfa915b.png)
6. I重新加密B<sub>N</sub>，向B假装他成功解密了。

	![](http://upload.wikimedia.org/math/8/f/d/8fd48867959a9886843676ab3364be90.png)

最后，B错误的以为A在与他进行通信，随机数N<sub>A</sub>和N<sub>B</sub>仅仅被A和B知道。

####防止中间人攻击
这个攻击方法是1995年Gavin Lowe在他的一篇论文中首次提出。文中还提供了该协议的一个修复版本，被称作Needham–Schroeder–Lowe协议。修复版本修改了第六步的消息。

![](http://upload.wikimedia.org/math/3/3/5/33583fcf1b33ad5e83c914ef6c529530.png)

改为：

![](http://upload.wikimedia.org/math/c/5/8/c58c49f7dc501dc733a4053f88ce245f.png)



###参考资料
[1]. 《[Kerberos:The Definitive Guide](http://shop.oreilly.com/product/9780596004033.do)》by Jason Garman August 2003    
[2]. 《[Using Encryption for Authentication in Large Networks of Computers](http://jmiller.uaa.alaska.edu/cse465-fall2012/papers/needham1978.pdf)》Roger M.Needham and Michael D. Schroeder 1978   
[3]. [Needham–Schroeder protocol](http://en.wikipedia.org/wiki/Needham%E2%80%93Schroeder_protocol) from Wikipedia   
[4]. [Security protocol notation](http://en.wikipedia.org/wiki/Security_protocol_notation) from Wikipeida

