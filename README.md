# Truecaller Telegram Bot

Get caller ID notifications on Telegram without installing the Truecaller app!

<br>

### Why?

Truecaller and other similar function apps are notorious for exploiting contact information from your phone, which is needed to build their database and provide accurate information. Unfortunately there is no way to opt out of this, and to get caller ID notifications you need to share your contacts. This bot does the same thing without exploiting your privacy.

<br>

### Real Time Caller ID

This requires a supplemental Android app to be installed to detect phone number calling and pass it to the bot using Telegram Client API, you'll need to create an app on https://my.telegram.org, and provide API_ID and API_HASH values. The app will detect calling notifications to get the phone number and use the client API to message the bot on your behalf.

The app is a work in progress currently. In the future I plan to integrate a DBaaS connection which will eliminate the need for the client API. But it remains to be seen if the latency will not be a hindrance.

You can still use the bot without it, but it is needed for real-time notifications. You'll need to manually copy paste the phone number after a call and send it to the bot, which in my opinion defeats the purpose of caller ID.

<br>

### Install

1. Clone git repo.
2. Run ```npm i``` in project folder. This will install the required dependencies.
3. Populate .env file with bot token, bot dev ID and Truecaller Installation ID (hereinafter referred to as IID).

#### *Note:* Bot token can be obtained from @BotFather.

#### Bot dev ID refers to the user ID of your Telegram account. This ensures there is no unauthorized access.

4. Run ```node bot``` to start the bot.

#### It's advisable to run the bot using PM2 or any startup manager for persistent execution, as this ensures you won't have to have the terminal open. You can set up auto-start as well. Or pass a cron job.

<br>

### Uninstall

1. Use ```rm -rf```.

*Note:* If you're unfamiliar with this command, delete project folder from file explorer.

2. Run ```npm uninstall -g truecallerjs``` to uninstall the truecallerjs lib. This is not needed after the initial run as it's only used to get the IID and can be uninstalled.

<br>

### Steps to get IID

#### From the sumithemmadi/truecallerjs repo.

<br>

1. Run ```npm i -g truecallerjs```. Depending on your npm setup you may need to use sudo.
2. Run ```truecallerjs login```. This will ask for your phone number and an OTP to login to Truecaller.
3. Then run ```truecallerjs -i -r``` to get the IID.

<br>

### Mechanism

The lib truecallerjs is used as a module. The bot is able to detect phone number formats (country codes) as well as spacings from text. Upon input, it will look for a phone number and pass it to truecallerjs to get details. Selected details such as name & country are sent back to the user.

The app is work in progress (WIP) and will provide real time notifications by detecting calling notifications and extracting phone number that is calling.

<br>

### License

##### AGPL v3

