---
layout: post
title: "Capistrano在每台应用服务器上都执行数据库迁移"
date: 2014-05-20 23:47:44 +0800
comments: true
categories: 
---
> Capistrano发布Rails app到远端服务器时，只在primary db服务器上执行db:migrate。对于每个app都使用独立的本地Sqlite数据库的场景不适用。

通过添加如下task，在每台app服务器上执行db:migrate

	#lib/capistrano/task/migrate_all.rake
	
 	desc 'Runs rake db:migrate on all app server'
 	task :migrate_all => [:set_rails_env] do
		on roles(:app), in: :parallel do
			within release_path do
				with rails_env: fetch(:rails_env) do
					execute :rake, "db:migrate"
				end
			end
		end
	end
	
	after :updated, :migrate_all