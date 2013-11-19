---
layout: post
title: "Nginx反向代理映射成子路径"
date: 2013-09-12 17:41
comments: true
categories: 
---
> 终于搞定了困扰已久的nginx反向代理子路径映射问题

多个web应用共享一个域名和端口时，可以考虑把不同的web应用映射成不同的子路径，这个子路径在Java EE里称作ContextPath。下面的配置片段解决nginx作为前端，反向代理多个tomcat主机，通过不同子路径共享一个域名的情况。


	server {
        listen       80;
        server_name  _;
        index index.html index.htm index.php;
        root /home/dashboard;

        location /dashboard {
         	rewrite /dashboard/(.*) /$1 break;
          	rewrite ^/dashboard$ /dashboard/ permanent;
          	proxy_pass http://127.0.0.1:9082;
          	proxy_redirect off;
          	proxy_set_header Host $host;
          	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    	}
	}
	
	
###参考阅读

1. [Nginx_As_a_Reverse_Proxy](http://wiki.apache.org/couchdb/Nginx_As_a_Reverse_Proxy)
2. [How do I reverse proxy etherpad-lite with nginx to a subdirectory](http://superuser.com/questions/603373/how-do-i-reverse-proxy-etherpad-lite-with-nginx-to-a-subdirectory)

