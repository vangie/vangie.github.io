---
layout: post
title: "Master-Agent模式的Rails应用借助JWT Token验证"
date: 2014-05-17 17:35:50 +0800
comments: true
categories: 
---
> 一对Master-Agent模式Rails应用，Agent需要验证Master。通常考虑采用HTTP基础认证或者HTTP摘要认证。这里Agent不需要多用户支持，所以只要一个加密口令即可，无需用户名。本文介绍采用JWT实现基于Token验证，结合Rails 4.1的新特性，装载secrets.yml文件里的密钥，作为JWT Token的计算密钥，应用于Rails应用。

### Agent端配置
#### 安装jwt Gem
Gemfile添加如下行
	gem 'jwt'
然后执行`bundle install`
<!-- more -->
#### 让所有Controller验证JWT Token
编辑`app/controllers/application_controller.rb`文件，
	require 'jwt'
	class ApplicationController < ActionController::Base
		...
  	before_action :validate_token
		
  	# Validate JWT token
  	def validate_token
    	begin
      	authz_header = request.headers['Authorization']
      	if authz_header.nil?
        	raise SecurityError.new("Authorization Header is missing")
      	end
      	token = authz_header.split(' ').last
      	JWT.decode(token, Rails.application.secrets.jwt_secret_key)
    	rescue JWT::DecodeError, SecurityError
      	render nothing: true, status: :unauthorized
    	end
  	end
		...
	end

其中密钥`Rails.application.secrets.jwt_secret_key`需要配置`config/secrets.yml`。

#### 配置config/secrets.yml
	development:
		secret_key_base: c5e867eee171336e0b00d648a3d73cd176379ad9bc556ccc34102a046893c451add2b2fccb6d3ea914834cd9737e6ca432ecdf6cef8c81b61b79c8cad412ac88
		jwt_secret_key: c5e867eee171336e0b00d648a3d73cd176379ad9bc556ccc34102a046893c451add2b2fccb6d3ea914834cd9737e6ca432ecdf6cef8c81b61b79c8cad412ac88
	
	test:
		secret_key_base: eaddadc7e11e7228c78670537d53a5b62d5b3908a84dcad6340c4a8104052b9043271bb03ae1ce11b03efe72ce4547aec61a9b71891451568a1084c80ba388d2
		jwt_secret_key: c5e867eee171336e0b00d648a3d73cd176379ad9bc556ccc34102a046893c451add2b2fccb6d3ea914834cd9737e6ca432ecdf6cef8c81b61b79c8cad412ac88
	
	# Do not keep production secrets in the repository,
	# instead read values from the environment.
	production:
		secret_key_base: <%= ENV["SECRET_KEY_BASE"] %>
		jwt_secret_key: <%= ENV["JWT_SECRET_KEY"] %>

开发和测试环境取静态值，部署环境取环境变量的值。

#### 配置.env文件存放环境变量
安装 dotenv gem，修改Gemfile，添加如下行
	gem 'dotenv-rails'
**请将'dotenv-rails'放在其他依赖环境变量的gem的前面**，保存后执行`bundle install`

Rails.Root目录新建`.env`文件
	JWT_SECRET_KEY: 4efe25e7fb153c392baf0787ee78c153a4fba5e6d7c8715b4a03849cd8a13b064ad2a636845e6753481613111dffb3c48c9a5a84fc38d50b757b3a2f46b8a493
	SECRET_KEY_BASE: 2d78298e02650fefd0381ae0be261064466ac028567a8c5d113b46f0e4696d3153b8bac9ab62828b2befc08c48b009678d4b5de0f47b72f7e5fce51800ce5fee

然后将`.env`添加到`.gitignore`里去，防止其被提交到版本库

#### 与Capistrano集成
修改config/deploy.rb文件，添加如下Task

	namespace :deploy do
		desc 'Generate Secret key to .env file'
  	task :generate_sceret_key do
    	on roles(:app), in: :parallel do
      	within release_path do
        	if test("! grep -q JWT_SECRET_KEY #{release_path.join('.env')}")
         		execute :rake, 'env:generate_secret[JWT_SECRET_KEY]'
       		end
       		if test("! grep -q SECRET_KEY_BASE #{release_path.join('.env')}")
         		execute :rake, 'env:generate_secret[SECRET_KEY_BASE]'
       		end     
     		end
   		end
 		end
 		after :updated, :generate_sceret_key
	end
### Master端配置
采用RestClient与Agent端进行通信，需要在请求的头部加入JWT Token以通过Agent端验证。
	#sync with agent
	def sync
		res = site['sync.json'].get
		json =  JSON::parse(res.body)
		puts json
	end

	#generate jwt token
	def generate_token
		unless self.secret_key.nil?
			self.token = JWT.encode("something_to_secret", self.secret_key)
		end
	end
	
	private
		def site
			@_site ||= RestClient::Resource.new(self.endpoint, :headers => {"Authorization" => "Bearer #{self.token}"})
		end

### 参考阅读
1. [JWT based authentication with Ember.js and Rails](http://blog.yanted.com/2014/02/13/jwt-based-authentication-with-ember-js-and-rails/)
2. [Loads environment variables from '.env'](https://github.com/bkeepers/dotenv)
3. [Generate a New Secret Token for Rails Apps](http://www.jamesbadger.ca/2012/12/18/generate-new-secret-token/)
4. [A better way to manage the Rails secret token](http://daniel.fone.net.nz/blog/2013/05/20/a-better-way-to-manage-the-rails-secret-token/)
5. [Rails 4.1 generates a new secrets.yml file in the config folder](http://edgeguides.rubyonrails.org/4_1_release_notes.html#config/secrets.yml)