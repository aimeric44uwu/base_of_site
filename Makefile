
MKFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))

all: env_file setting_up_node setting_up_npm checking_node_modules check_snapd check_certbot check_pm2 check_mongodb check_noip generate_ssl check_ssl start_server

env_file:
	@if [ ! -f .env ]; then \
		echo -n "Do you want to create and configure the .env file (y/n, c to cancel) : "; \
		read answer; \
		if [ $$answer = "y" ]; then \
			echo "Creating and configuring .env file ..."; \
			rm -f .env; \
			touch .env; \
			echo ; \
			echo -n "enter your session secret ( leave blank to generate a random session secret ) : "; \
			read session_secret; \
			if [ -z $$session_secret ]; then \
				echo "SESSION_SECRET=$$(openssl rand -base64 45)" > .env; \
			else \
				echo "SESSION_SECRET=$$session_secret" > .env; \
			fi; \
			echo ; \
			echo -n "enter your jwt hash ( leave blank to generate a random jwt hash ) : "; \
			read jwt_secret; \
			if [ -z $$jwt_secret ]; then \
				echo "JWT_SECRET=$$(openssl rand -base64 45)" >> .env; \
			else \
				echo "JWT_SECRET=$$jwt_secret" >> .env; \
			fi;\
			echo ; \
			echo -n "enter an email adress that will be used to send password reset link : "; \
			read mail; \
			if [ -z $$mail ]; then \
				echo "USER=" >> .env; \
				echo "you didn't enter anything, this case will stay blank"; \
			else \
				echo "USER=$$mail" >> .env; \
			fi;\
			echo ; \
			echo -n "enter the password of the mail adress : "; \
			read mail_password; \
			if [ -z $$mail_password ]; then \
				echo "PASSWORD=" >> .env; \
				echo "you didn't enter anything, this case will stay blank"; \
			else \
				echo "PASSWORD=$$mail_password" >> .env; \
			fi;\
			echo ; \
			echo "enter the base url it will be used to generate password reset link ( don't forget the last / ) it can be for example https://mysite.com/ or http://localhost:3000/ : "; \
			read baseurl; \
			if [ -z $$baseurl ]; then \
				echo "BASE_URL=http://localhost/" >> .env; \
				echo "you didn't enter anything, this case will be http://localhost/ by default"; \
			else \
				echo "BASE_URL=$$baseurl" >> .env; \
			fi;\
			echo ; \
						echo "enter the port that the site will use ( note that if your site is a http i recommand you to use the port 80 but if yout website is a https i recommand you to use the port 443 ) : "; \
			read port; \
			if [ -z $$port ]; then \
				echo "PORT=" >> .env; \
				echo "you didn't enter anything, this case will stay blank"; \
			else \
				echo "PORT=$$port" >> .env; \
			fi;\
			echo ; \
			echo -n "enter the adress of the mongodb ( by default it is : mongodb://127.0.0.1:27017/ ) but if you have a mongodb server you will need to enter the full adress that should look like that : mongodb://<username>:<password>@<adress>:<port>/ ( when you complete the adress remember to delete the < > ) : "; \
			read mongo_uri; \
			if [ -z $$mongo_uri ]; then \
				echo "MONGO_URL='mongodb://127.0.0.1:27017/'" >> .env; \
				echo "you didn't enter anything, the adress entered is the default adress ( mongodb://127.0.0.1:27017/ ) "; \
			else \
				echo "MONGO_URL='$$mongo_uri'" >> .env; \
			fi;\
			echo ; \
			echo -n "enter the name of your database or the name you want to give to your database if it isn't already created : "; \
			read dbname; \
			if [ -z $$dbname ]; then \
				echo "DB_NAME='site_db'" >> .env; \
				echo "you didn't enter anything, this case will take the value : site_db"; \
			else \
				echo "DB_NAME='$$dbname'" >> .env; \
			fi;\
			echo ; \
			echo "ENABLE_EXTERNAL_API=false" >> .env; \
			# echo -n "do you want to use a separated api ( usefull for server with cores that have low computing power ) (y/n) : "; \
			# read externalapi; \
			# if [ -z $$externalapi ]; then \
			# 	echo "ENABLE_EXTERNAL_API=false" >> .env; \
			# 	echo "you didn't enter anything, this case is false by default"; \
			# elif [ $$externalapi = "y" ]; then \
			# 	echo "ENABLE_EXTERNAL_API=true" >> .env; \
			# elif [ $$externalapi = "n" ]; then \
			# 	echo "ENABLE_EXTERNAL_API=false" >> .env; \
			# else \
			# 	echo "ENABLE_EXTERNAL_API=false" >> .env; \
			# 	echo "wrong input, this case is false by default"; \
			# fi;\
			# echo ; \
			# if [ "$$(grep 'ENABLE_EXTERNAL_API' .env | cut -d '=' -f 2)" = "true" ]; then \
  			# 	echo -n "enter the api adress ( if the api process is running on the same ip just put the adress of the site for example http://1.1.1.1/ or https://mysite.com/ ) don't forger the last / : "; \
			# 	read apiurl; \
			# 	if [ -z $$apiurl ]; then \
			# 		echo "API_URL=" >> .env; \
			# 		echo "you didn't enter anything, this case will stay blank"; \
			# 	else \
			# 		echo "API_URL='$$apiurl'" >> .env; \
			# 	fi;\
			# 	echo -n "enter the port used by the api ( leave blank if your api url is a http on port 80 or a https on port 443 ) : "; \
			# 	read apiport; \
			# 	if [ -z $$apiport ]; then \
			# 		echo "API_PORT=" >> .env; \
			# 		echo "you didn't enter anything, this case will stay blank"; \
			# 	else \
			# 		echo "API_PORT='$$apiport'" >> .env; \
			# 	fi;\
			# else \
			# 	echo "API_URL=" >> .env; \
			# 	echo "API_PORT=" >> .env; \
			# fi;\
			echo ; \
			echo -n "do you want to enable ssl, ssl will allow you to have https website but you will need to generate a ssl certificate ( y/n ) : "; \
			read ssl_value; \
			if [ -z $$ssl_value ]; then \
				echo "ENABLE_SSL=false" >> .env; \
				echo "you didn't enter anything, this case is false by default"; \
			elif [ $$ssl_value = "y" ]; then \
				echo "ENABLE_SSL=true" >> .env; \
			elif [ $$ssl_value = "n" ]; then \
				echo "ENABLE_SSL=false" >> .env; \
			else \
				echo "ENABLE_SSL=false" >> .env; \
				echo "wrong input, this case is false by default"; \
			fi;\
			echo ; \
			echo -n "enter the website url ( usefull only if you activate ssl, it will be used to generate a ssl certificate thanks to certbot ) don't put the http:// or https:// and don't put the last / : "; \
			read website_url; \
			if [ -z $$website_url ]; then \
				echo "WEBSITE_URL=" >> .env; \
				echo "you didn't enter anything, this case will stay blank"; \
			else \
				echo "WEBSITE_URL=$$website_url" >> .env; \
			fi;\
			echo ; \
			echo -n "enter the complete email adress of the owner ( same as before it is only used to generate a ssl certificate ) : "; \
			read owner_mail; \
			if [ -z $$owner_mail ]; then \
				echo "OWNER_MAIL=" >> .env; \
				echo "you didn't enter anything, this case will stay blank"; \
			else \
				echo "OWNER_MAIL=$$owner_mail" >> .env; \
			fi;\
			echo ""; \
			echo "DONE !"; \
			echo "you can still modify the .env file by typing nano .env"; \
		elif [ $$answer = "n" ]; then \
			echo "Not creating an .env file"; \
		elif [ $$answer = "c" ]; then \
			echo "Cancelling ..."; \
			exit 0; \
		else \
			echo "Incorrect input"; \
		fi \
	else \
		echo ".env file already exist"; \
	fi

setting_up_node:
	@if dpkg -s nodejs | grep Status | grep -q installed; then \
		echo "nodejs is correctly installed"; \
	else \
		echo -n "nodejs isn't correctly installed do you want to install it (y/n) : "; \
		read installnode; \
		if [ -z $$installnode ]; then \
			echo "you didn't enter anything, nodejs will not be installed"; \
		elif [ $$installnode = "y" ]; then \
			echo "installing nodejs ..."; \
			sudo apt update; \
			sudo apt install nodejs; \
		elif [ $$installnode = "n" ]; then \
			echo "nodejs will not be installed"; \
		else \
			echo "wrong input, nodejs will not be installed"; \
		fi;\
	fi


setting_up_npm:
	@if dpkg -s npm | grep Status | grep -q installed; then \
		echo "npm is correctly installed"; \
	else \
		echo -n "npm isn't correctly installed do you want to install it (y/n) : "; \
		read installnpm; \
		if [ -z $$installnpm ]; then \
			echo "you didn't enter anything, npm will not be installed"; \
		elif [ $$installnpm = "y" ]; then \
			echo "installing npm ..."; \
			sudo apt update; \
			sudo apt install npm; \
			sudo apt install build-essential; \
		elif [ $$installnpm = "n" ]; then \
			echo "npm will not be installed"; \
		else \
			echo "wrong input, npm will not be installed"; \
		fi;\
	fi

checking_node_modules:
	@if [ ! -d node_modules ]; then \
    	echo "the node_modules are still not installed do you want to install them ? (y/n) : "; \
		read installnodemodules; \
		if [ -z $$installnodemodules ]; then \
			echo "you didn't enter anything, the node_modules will not be installed"; \
		elif [ $$installnodemodules = "y" ]; then \
			echo "installing node_modules ..."; \
			npm i; \
		elif [ $$installnodemodules = "n" ]; then \
			echo "node_modules will not be installed"; \
		else \
			echo "wrong input, node_modules will not be installed"; \
		fi;\
	else \
		echo "node_modules are correctly installed"; \
  	fi

check_snapd:
	@if dpkg -s snapd | grep Status | grep -q installed; then \
		echo "snapd is correctly installed"; \
	else \
		echo -n "snapd isn't correctly installed do you want to install it (y/n) : "; \
		read installsnapd; \
		if [ -z $$installsnapd ]; then \
			echo "you didn't enter anything, snapd will not be installed"; \
		elif [ $$installsnapd = "y" ]; then \
			echo "installing snapd ..."; \
			sudo apt install snapd; \
		elif [ $$installsnapd = "n" ]; then \
			echo "snapd will not be installed"; \
		else \
			echo "wrong input, snapd will not be installed"; \
		fi;\
	fi


check_certbot:
	@if dpkg -s certbot | grep Status | grep -q installed; then \
		echo "certbot is correctly installed"; \
	else \
		echo -n "certbot isn't correctly installed do you want to install it, it is used to generate ssl certificate (y/n) : "; \
		read installcertbot; \
		if [ -z $$installcertbot ]; then \
			echo "you didn't enter anything, certbot will not be installed"; \
		elif [ $$installcertbot = "y" ]; then \
			echo "installing certbot ..."; \
			sudo snap install --classic certbot; \
		elif [ $$installcertbot = "n" ]; then \
			echo "certbot will not be installed"; \
		else \
			echo "wrong input, certbot will not be installed"; \
		fi;\
	fi

check_pm2:
	@if pm2 -v | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]'; then \
		echo "pm2 is correctly installed"; \
	else \
		echo -n "pm2 isn't correctly installed do you want to install it (y/n) : "; \
		read installpm2; \
		if [ -z $$installpm2 ]; then \
			echo "you didn't enter anything, pm2 will not be installed"; \
		elif [ $$installpm2 = "y" ]; then \
			echo "installing pm2 ..."; \
			sudo npm install pm2 -g; \
		elif [ $$installpm2 = "n" ]; then \
			echo "pm2 will not be installed"; \
		else \
			echo "wrong input, pm2 will not be installed"; \
		fi;\
	fi

check_mongodb:
	@if dpkg -s mongodb-org | grep Status | grep -q installed; then \
		echo "mongodb is correctly installed"; \
	else \
		echo -n "mongodb isn't correctly installed do you want to install it (y/n) : "; \
		read installmongodb; \
		if [ -z $$installmongodb ]; then \
			echo "you didn't enter anything, mongodb will not be installed"; \
		elif [ $$installmongodb = "y" ]; then \
			echo "installing mongodb ..."; \
			wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -; \
			echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list; \
			sudo apt-get update; \
			sudo apt-get install -y mongodb-org; \
			sudo systemctl start mongod; \
			sudo systemctl enable mongod; \
		elif [ $$installmongodb = "n" ]; then \
			echo "mongodb will not be installed"; \
		else \
			echo "wrong input, mongodb will not be installed"; \
		fi;\
	fi

check_noip:
	@if [ ! -f /usr/local/bin/noip2 ]; then \
		echo -n "you seems that you do not have installed noip do you want to install it (y/n) : "; \
		read installnoip; \
		if [ -z $$installnoip ]; then \
			echo "you didn't enter anything, noip will not be installed"; \
		elif [ $$installnoip = "y" ]; then \
			echo "installing noip ..."; \
			sudo cd /usr/local/src; \
			sudo wget http://www.no-ip.com/client/linux/noip-duc-linux.tar.gz; \
			sudo tar xzf noip-duc-linux.tar.gz; \
			sudo cd noip-2.1.9-1; \
			sudo make; \
			sudo make install; \
			cd $(MKFILE_PATH); \
		elif [ $$installnoip = "n" ]; then \
			echo "noip will not be installed"; \
		else \
			echo "wrong input, noip will not be installed"; \
		fi; \
	else \
		echo "noip correctly installed"; \
	fi


generate_ssl:
	@if [ "$$(grep 'ENABLE_SSL' .env | cut -d '=' -f 2)" = "true" ] && ([ ! -f certsFiles/privkey.pem ] || [ ! -f certsFiles/chain.pem ] || [ ! -f certsFiles/cert.pem ]); then \
		echo -n "you set ENABLE_SSL to true, do you want to generate certificate (y/n) : "; \
		read generatecertificate; \
		if [ -z $$generatecertificate ]; then \
			echo "you didn't enter anything, no certificate will be generated"; \
		elif [ $$generatecertificate = "y" ]; then \
			echo -n "do you want to generate a real certificate ( max 5 per day and you need to have previously installed certbot and snapd ) or a self-signed certificate, remember that to generate a ssl certificate the server will need to use the port 80 so make sure it isn't already used ( 1 or 2 ) : "; \
			read realorself; \
			if [ -z $$realorself ]; then \
				echo "you didn't enter anything, no certificate will be generated"; \
			elif [ $$realorself = "1" ]; then \
				echo "generating a real certificate ..."; \
				echo ; \
				cd certsFiles; \
				./generate_certificate_with_certbot; \
				cd $(MKFILE_PATH); \
				echo ; \
			elif [ $$realorself = "2" ]; then \
				echo "generating a self-signed certificate ..."; \
				echo ; \
				cd certsFiles; \
				./generate_self-signed_certificate_openssl; \
				cd $(MKFILE_PATH); \
				echo ; \
			else \
				echo "wrong input, no certificate will be generated"; \
			fi;\
		elif [ $$generatecertificate = "n" ]; then \
			echo " no certificate will be generated"; \
		else \
			echo "wrong input,  no certificate will be generated"; \
		fi;\
	fi


check_ssl:
	@if [ "$$(grep 'ENABLE_SSL' .env | cut -d '=' -f 2)" = "true" ]; then \
		if [ ! -f certsFiles/cert.pem ]; then \
			echo "you enable ssl but i can't find the file cert.pem in the certsFiles folder"; \
		fi; \
		if [ ! -f certsFiles/chain.pem ]; then \
			echo "you enable ssl but i can't find the file chain.pem in the certsFiles folder"; \
		fi; \
		if [ ! -f certsFiles/privkey.pem ]; then \
			echo "you enable ssl but i can't find the file privkey.pem in the certsFiles folder"; \
		fi; \
		if [ -f certsFiles/privkey.pem ] && [ -f certsFiles/chain.pem ] && [ -f certsFiles/cert.pem ]; then \
			echo "every needed ssl file are present"; \
		else \
			echo "IMPORTANT : generate the missing file before starting the server or modify the .env file and update ENABLE_SSL to false"; \
		fi \
	fi


start_server:
	@echo -n "do you want to start the server using pm2 ? (y/n) : "; \
	read pm2start; \
	if [ -z $$pm2start ]; then \
		echo "you didn't enter anything, pm2 server will not start"; \
	elif [ $$pm2start = "y" ]; then \
		echo "starting pm2 server ..."; \
		pm2 start index.js; \
		if [ "$$(grep 'ENABLE_EXTERNAL_API' .env | cut -d '=' -f 2)" = "true" ]; then \
			echo ; \
			echo "you activate the external api do you want to start the api script ( in this case the api url will be the same as the url ) (y/n) : ";\
			read launchapi; \
			if [ -z $$launchapi ]; then \
				echo "you didn't enter anything, the api script will not start"; \
			elif [ $$launchapi = "y" ]; then \
				echo "launching the api script ..."; \
				pm2 start api/api.js; \
			elif [ $$launchapi = "n" ]; then \
				echo "the api script will not start"; \
			else \
				echo "wrong input, the api script will not start"; \
			fi;\
		fi; \
		pm2 save; \
		echo ; \
		echo "you can see the current online server using the command pm2 ls"; \
		echo "you can stop a process by typing pm2 stop ID"; \
		echo "you can restart a process by typing pm2 restart ID"; \
		echo "you can lookup to the log by typing pm2 log ID it can help you debug"; \
		echo ; \
	elif [ $$pm2start = "n" ]; then \
		echo "pm2 server will not start"; \
	else \
		echo "wrong input, pm2 server will not start"; \
	fi;\
