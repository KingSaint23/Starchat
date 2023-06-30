<p align="center">
  <img src="images/Starchat_Logo.png" height="400px"/>
</p>


# 💠Starchat💠
> Your Personal Assisstant, on WhatsApp!


Starchat is an optimized and easy-to-use WhatsApp UserBot written in Node.js.

Utilize your personal chat assistant/group manager to make the most out of WhatsApp.   



## Deployment

<b>Only local deployment is working for now!</b>

### Easiest Way

You can deploy Starchat in minimal time without any prior knowledge using this method.

1. Head over to Starchat's [Official website](https://myStarchat.com/) and create an account on heroku using your email ID.
2. Once logged in, click on the "Deploy Starchat" button in the sidebar.
3. Scan the QR code shown using your WhatsApp account (3 dots on top right corner -> Linked devices -> LINK A DEVICE). Click on the 'Continue'      button once done.
4. Once the bot is linked to your account, you will come across a form which can be used to manage settings/permissions of Starchat. If required,    change the form fields. Then, click on the submit button.
5. Wait for 1-3 minutes for the bot to start. This is a one time process. Try using the '.alive' command in any of your chats to verify whether    your bot has been deployed succesfully.

Voila! You have deployed your bot in 5 easy steps. Once the bot has started successfully, you'll see a integration message on your whatsapp account.

### Manually on Heroku

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