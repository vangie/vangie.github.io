---
layout: post
title: "Eclipse插件通过Maven依赖第三方jar包"
date: 2012-09-05 22:32
comments: true
categories: 
---
>Osgi和Maven都分别提供了依赖管理的机制，在Osgi世界可以被依赖的单元称之为Bundle(一种特殊格式的jar)，在Maven世界称之为POM。各自的领域中都是优雅的技术，但是当两者结合在一起，就不那么美好了。

### tycho让plugin和maven结合在一起

[tycho]可以让一个eclipse plugin项目变成一个maven项目，把maven的自动构建和自动测试的优势带到了plugin项目。但是maven的另一个优势依赖管理并没有能够和plugin项目结合。

<!-- more -->

### OSGI如何处理依赖

先简单介绍一下plugin项目不与maven结合的时候如何处理依赖问题。Eclipse plugin是构建在Osgi技术之上的，或者说Eclipse是Osgi规范的一种实现。

Osgi里每个独立的项目或者jar称之为Bundle，Bundle有生命周期，Osgi平台负责管理Bundle的生命周期状态和依赖关系。和Maven Repository类似，Osgi也有所谓的仓库，[SpringSource Enterprise Bundle Repository]和[Eclipse Project Juno Software Repository]就是[Spring DM]和Eclipse为各自的OSGI实现提供的官方仓库。

使用Maven的时候常常会发现总有几个包是仓库里找不到的。Osgi环境下也类似，通常有两种做法：

* 通过工具直接把jar包转换成Bundle，Peter Kriens开发的[Bnd]是OSGI里的瑞士军刀。
* 把许多第三方jar嵌入到某个Bundle里，通过Osgi的`Export-Package`机制，将这些jar包里的类开放出来

Eclipse plugin开发常用后一种方法。但是这些第三方jar包需要单独去下载，对于用惯maven的开发者来说，很难接受。

下面就介绍如何使用maven技术来构建这个jar包集bundle,我们将使用一个由[Apache Felix](http://felix.apache.org)项目提供的maven插件[maven-bundle-plugin]

### 通过maven-bundle-plugin包含第三方依赖的Bundle

[maven-bundle-plugin]提供了详尽的文档和示例关于如何使用该maven插件，这里就不啰嗦了，直接贴出好用的pom文件片段吧

	<project 
	xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
		
		...

		<dependencies>
			<dependency>
				<groupId>com.fasterxml.jackson.core</groupId>
				<artifactId>jackson-databind</artifactId>
				<version>2.0.5</version>
			</dependency>	
		</dependencies>


		<build>
			<plugins>
				<plugin>
					<groupId>org.apache.felix</groupId>
					<artifactId>maven-bundle-plugin</artifactId>
					<version>2.1.0</version>
					<extensions>true</extensions>
					<configuration>
						<manifestLocation>META-INF</manifestLocation>
						<instructions>
							<Bundle-SymbolicName>${project.artifactId}</Bundle-SymbolicName>
							<Bundle-RequiredExecutionEnvironment>
								J2SE-1.5
							</Bundle-RequiredExecutionEnvironment>
							<Embed-Dependency>
								*;scope=compile|runtime;inline=false
							</Embed-Dependency>
							<_exportcontents>
								com.fasterxml.jackson.core.*,
								com.fasterxml.jackson.databind.*,
								com.fasterxml.jackson.annotation.*
							</_exportcontents>
							<Bundle-ClassPath>.,{maven-dependencies}</Bundle-ClassPath>
							<Embed-Transitive>true</Embed-Transitive>
							<Embed-Directory>jars</Embed-Directory>
							<Embed-StripGroup>true</Embed-StripGroup>
							<_failok>true</_failok>
							<_nouses>true</_nouses>
						</instructions>
					</configuration>
				</plugin>
				<plugin>
					<artifactId>maven-dependency-plugin</artifactId>
					<executions>
			
						<execution>
							<id>copy-dependencies</id>
							<phase>package</phase>
							<goals>
								<goal>copy-dependencies</goal>
							</goals>
							<configuration>
								<outputDirectory>jars</outputDirectory>
							</configuration>
						</execution>
					</executions>
				</plugin>
			</plugins>
			<pluginManagement>
				<plugins>
					<!--This plugin's configuration is used to store Eclipse m2e settings 
						only. It has no influence on the Maven build itself. -->
					<plugin>
						<groupId>org.eclipse.m2e</groupId>
						<artifactId>lifecycle-mapping</artifactId>
						<version>1.0.0</version>
						<configuration>
							<lifecycleMappingMetadata>
								<pluginExecutions>
									<pluginExecution>
										<pluginExecutionFilter>
											<groupId>
												org.apache.maven.plugins
											</groupId>
											<artifactId>
												maven-dependency-plugin
											</artifactId>
											<versionRange>
												[2.1,)
											</versionRange>
											<goals>
												<goal>
													copy-dependencies
												</goal>
											</goals>
										</pluginExecutionFilter>
										<action>
											<execute></execute>
										</action>
									</pluginExecution>
								</pluginExecutions>
							</lifecycleMappingMetadata>
						</configuration>
					</plugin>
				</plugins>
			</pluginManagement>
		</build>
	</project>

一些说明，这个pom会生成Osgi的描述文件`META-INF/MANIFEST.MF`,但是不会将jars目录下的jar加到`Referenced Libraries`里去，虽然`Maven Dependencies`里有，但是仍然会导致PDE编辑器对`Export-Package`段的校验报错。所以需要在PDE编辑器`Runtime->Classpath`里把jar全部删掉，再重新添加一次。

#### 参考文献

1. [Bundle Plugin for Maven](http://felix.apache.org/site/apache-felix-maven-bundle-plugin-bnd.html)
2. [No required execution environment has been set” from Maven Bundle Plugin](http://maxrohde.com/2010/12/02/%E2%80%9Cno-required-execution-environment-has-been-set%E2%80%9D-from-maven-bundle-plugin/)
3. [Maven Dependency plugin > dependency:copy-dependencies](http://maven.apache.org/plugins/maven-dependency-plugin/copy-dependencies-mojo.html)





[SpringSource Enterprise Bundle Repository]: http://ebr.springsource.com/repository/app/ "Bundle Repository for OSGI"
[Eclipse Project Juno Software Repository]:http://download.eclipse.org/eclipse/updates/4.2/ "The software repository for the Eclipse Project"
[Bnd]: http://www.aqute.biz/Bnd/Bnd "the Swiss army knife of OSGi"
[maven-bundle-plugin]: http://felix.apache.org/site/apache-felix-maven-bundle-plugin-bnd.html "Bundle Plugin for Maven"
[tycho]: http://www.eclipse.org/tycho/ "Building Eclipse plug-ins with maven"
[Spring DM]: http://www.springsource.org/osgi "Spring Dynamic Modules"
			