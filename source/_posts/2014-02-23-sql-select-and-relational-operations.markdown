---
layout: post
title: "SQL Select和关系操作"
date: 2014-02-23 19:55:31 +0800
comments: true
categories: 
---
>没有系统的学习过关系数据库，所以对SQL Select的理解有些浅薄，特别是group by和having语句。[《SQLite 权威指南（第二版）》](http://book.douban.com/subject/7061934/)的第三章SQLite中的SQL，让我对Select，乃至SQL语言和关系数据库有了全新的认识。一时间激起了对关系数据库和理论的兴趣，到豆瓣上淘了一本绝版的[《深度探索关系数据库》](http://book.douban.com/subject/2122940/)，可惜基础太差，读了一半实在读不下去了，作罢。

最大的收获和发现莫过于下面这幅图了，

![select处理过程](/images/post/2014-02-23/select.png)

<!-- more -->

说明：

- 多张表通过笛卡尔积（Cartesian Production）或者连接（Join）产生R1
- R1到R2的过程称作限制（Restriction），即过滤掉不符合条件的行（元组）
- R4到R5的过程称作投影（Projection），即选择出需要的列（属性）

###参考阅读
1. [《SQLite 权威指南（第二版）》](http://book.douban.com/subject/7061934/)