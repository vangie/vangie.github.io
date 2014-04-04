---
layout: post
title: "基于Token的认证和基于声明的标识"
date: 2014-03-26 14:12:05 +0800
comments: true
categories: 
---

> OpenID解决跨站点的认证问题，OAuth解决跨站点的授权问题。认证和授权是密不可分的。而OpenID和OAuth这两套协议出自两个不同的组织，协议上有相似和重合的之处，所以想将二者整合有些难度。好在OpenID Connect作为OpenID的下一版本，在OAuth 2.0的协议基础上进行扩展，很好的解决了认证和授权的统一，给开发者带来的便利。在学习和研究OpenID Connect协议时，遇上两个概念基于Token的认证（token based authentication）和基于声明的标识（claims based identity）。本文就这两个概念展开讨论，为了更好的理解OpenID Connect协议的原理。

###基于Cookie的认证和基于Token的认证   

有两种不同的方法实现服务端的认证   

* 常见方式是**基于Cookie的认证**,每个请求中携带Cookie信息以便于服务端识别
* 另一种新方法，**基于Token的认证**，在每个请求中携带被签名过Token信息传送到服务端

[![Cookie-based Auth vs Token-based Auth](/images/post/2014-03-26/cookie-based-auth-vs-token-based-auth.png)](https://docs.google.com/drawings/d/1IPgSFz2loaOIrnIKinGyrSoRm54slHFi8d_oRJ7BGPc/edit?usp=sharing)

<!-- more -->
相比Cookie，基于Token的认证有如下好处：   

* **跨域**: cookies在跨域场景表现并不好。基于Token的方法允许你向任何不同域名的服务器发送Ajax请求，因为你可以通过HTTP头传递用户信息。
* **无状态**（或者 服务端可扩展）：无须再存储Session，由于Token已经自包含了所有的用户信息。
* **内容分发**：你可以将所有的静态资源（例如：脚本，HTML，图片等）分发到CDN服务上，你的服务器仅仅提供API。[某些CDN服务商](http://www.internap.com/cdn-services-content-delivery-network/cdn-user-authentication/)提供了基于Token验证的安全服务。
* **解耦**：无须被绑定在一个特定的验证方案。
* **移动支持**：在移动设备的原生平台，使用cookie作为安全认证并不是好主意。采用基于Token的方法会简单得多。
* **跨站点脚本攻击**：由于没有基于cookie技术，你不再需要考虑跨站点请求的安全性问题。
* **性能**：虽然没有做严格的性能测试，但是还原session所做的数据库查询往返的性能损耗要大于`HMACSH256`算法验证和解析Token。
* **基于标准**：JWT([JSON Web Token](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token))作为Token的标准已经被广泛的接受。主流语言（.NET, Ruby, Java, Python, PHP）都有相应支持JWT标准的工具包。

###JWT格式
<abbr title="JSON Web Token">JWT</abbr>是一种紧凑的URL安全表示格式，适用于空格受限制的场景，比如HTTP授权头部和请求参数。JWT使用JSON格式表示一组声明，该JSON被编码成<abbr title="JSON Web Signature">JWS</abbr>或<abbr title="JSON Web Encryption">JWE</abbr>结构。

{% gist 9976896 headers.json %}

###基于声明的标识
Cookie在请求和响应之间反复传递，对于无状态的HTTP协议，在Cookie里加入一个会话ID，以标识一组请求和响应属于同一会话。通常会话与用户是多对一关系，也就是说一个会话只会属于一个用户。所以通过Cookie技术就可以标识出用户。通常Cookie里也会携带一些额外的信息，但是考虑Cookie容易被截获和篡改，所以Cookie里并不适合放置用户的基本信息。

Token其实和Cookie类似是一段序列化字符串，作为HTTP请求头的一部分，发送到服务端。但是Token加入了签名机制，可以防篡改。所以Token可以包含用户信息发送给不同域的应用服务作为身份标识，只要相应的应用服务能识别其有效性。

Token仅仅是某种信息的承载形式，基于Token的认证有一个更宽泛的概念：基于声明的标识

[![Claims based Identity](/images/post/2014-03-26/claims-based-identity.png)](https://docs.google.com/drawings/d/1bSBW-rNfOUA4jsWVABXyuJklNY-hXI8QRMRtarh5Ek4/edit?usp=sharing)

基于声明的标识其实无处不在，举个我们很熟悉的例子。

每次机场登机前过安检时，你不能简单地走到门口，并出示身份证。相反，必须先办理登机手续柜台。如果出国，还需要出示护照。安检人员先验证证件头像与你本人是否一致，然后核实您的信息，并确认您已经购买了机票。假设一切顺利，您将获得登机牌。

登机牌上包括知道您的姓名，航班号和座位号等常规信息。安检人员可以从登机牌上获得足够的信息以配合他们的工作。

登机牌上还有一些特殊信息，包含在条形码和背面的磁条里，以证明该登机牌是由航空公司签发的，而不是伪造的。

从本质上说，登机牌是一个由航空公司签发的关于你的一组信息。它表明你被允许某时登上某飞机坐在某个座位。当然，安检人员不必深入地理解这些。他们只需验证您的登机牌，读取其中的信息，然后让你登机。

同样值得注意的是，可能有不止一种方法获得您的登机牌。可能去机场售票柜台领取，或者在家里从航空公司网站下载并打印。安检人员不在乎的登机牌是如何获得的 。他们只关心登机牌是否真实的。

登机牌就是一张包含了一组声明信息的卡片，是Token的一种实体形式。

###参考阅读
1. 《A Guide to Claims-Based Identity and Access Control》
2. http://dotnetcodr.com/2014/01/20/introduction-to-oauth2-json-web-tokens/
3. http://www.layer7tech.com/blogs/index.php/give-me-a-jwt-ill-give-you-an-access-token/
4. http://en.wikipedia.org/wiki/Claims-based_identity
5. http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/
6. http://jpadilla.com/post/73791304724/auth-with-json-web-tokens
7. http://openid.net/specs/draft-jones-json-web-token-07.html

