# mdm-remote-education
The remote education service for  MDM company

## Installing dependencies
Run `yarn install` or `npm install` to install all dependencies for the project.

## Development server
Run `npm run start` for a frontend webpack server. Navigate to `http://localhost:8080/`. The app will automatically reload if you change any of the source files.

###Backend

# Steps for install and start BBDEMO NodeJS server application

* Install [MongoDB](https://docs.mongodb.com/manual/installation/)
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64,ppc64el,s390x ] http://repo.mongodb.com/apt/ubuntu xenial/mongodb-enterprise/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-enterprise.list
sudo apt-get update
sudo apt-get install -y mongodb-enterprise
systemctl enable mongod.service
sudo service mongod start
```
* Install [Node.js](https://nodejs.org/en/download/package-manager/)

* Run command from command shell in app root directory
```bash
npm install
```

* Install Redis https://redis.io/ for Socket message queue

* After all npm modules successfully installed run command
```bash
npm run server
```
* If you need debug log run command
```bash
DEBUG=express:* npm run server
```