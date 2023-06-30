<p align="center">
  <img src="images/Starchat_Logo.png" height="400px"/>
</p>


# 💠Starchat💠
> Your Personal Assisstant, on WhatsApp!


Starchat is an optimized and easy-to-use WhatsApp UserBot written in Node.js.

Utilize your personal chat assistant/group manager to make the most out of WhatsApp.   



## Deployment


<b>Deployment to heroku using the button is not working for now!</b>

You can deploy the bot the heroku yourself using the button below!

[![Deploy To Heroku](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?button-url=https%3A%2F%2Fgithub.com%2FKingSaint23%2FStarchat%2Ftree%2Fmain&template=https%3A%2F%2Fgithub.com%2FKingSaint23%2FStarchat%2Ftree%2Fmainhttps://dashboard.heroku.com/new?button-url=https%3A%2F%2Fgithub.com%2FKingSaint23%2FStarchat%2Ftree%2Fmain&template=https%3A%2F%2Fgithub.com%2FKingSaint23%2FStarchat%2Ftree%2Fmain)

### Using Docker locally

To follow this method, you will need to have docker installed on your machine and have some experience using docker.

To host the bot on your own device using docker, follow the following steps on your terminal / command prompt -

```bash
wget -O Starchat.tar.gz https://github.com/KingSaint23/Starchat/archive/refs/tags/v2.0.0-beta.tar.gz
tar -xvzf Starchat.tar.gz
cd Starchat-2.0.0-beta
docker build -t Starchat .
docker run --rm --name Starchat Starchat
```

This will create a container running Starchat. You'll have to scan the QR at least once.

### The GNU/Linux Legacy Way

To use this method, you will need ffmpeg, nodejs, npm installed on your device.

To run the bot on your device manually, you can use the following commands -

```bash
git clone https://github.com/KingSaint23/Starchat.git
cd Starchat
yarn
npm start
```

## Scan QR Code again
If you're having issues when running locally it is recommended to scan the code again. To get the QR code again, follow these commands -
```
rm -rf Starchat.db session.data.json
npm start
```

## Legal
This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by WhatsApp or any of its affiliates or subsidiaries. This is an independent and unofficial software. Use at your own risk.