# Truecaller Telegram Bot

Get caller ID notifications on Telegram without installing the Truecaller app!

<br>

### Why?

Truecaller and other similar function apps are notorious for exploiting contact information from your phone, which is needed to build their database and provide accurate information. Unfortunately there is no way to opt out of this, and to get caller ID notifications you need to share your contacts. This bot does the same thing without exploiting your privacy.

<br>

### Real Time Caller ID

_Note:_ This is a work in progress. Options like an IFTTT applet can also be explored. A backend would be even more preferable. Please refer to the contributions section if you're willing to provide an implementation for the same and feel free to open a PR. The general gist is to notify the Caller ID through the bot in real time by accessing incoming call information.


<br>

### Install

1. Clone git repo.
2. Run ```npm i``` in project folder. This will install the required dependencies.
3. Rename .env.example to .env and provide bot token, bot dev ID and Truecaller Installation ID (hereinafter referred to as IID).
4. Run ```node bot``` to start the bot.

<details>

<summary>
Bot dev ID
</summary>

<br>
Bot dev ID refers to the user ID of your Telegram account. This ensures there is no unauthorized access.

</details>

<br>

#### It's advisable to run the bot using PM2 or any startup manager for persistent execution.

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

Real time notifications are a work in progress (WIP).

<br>

### Contributions

Feel free to contribute towards the overall codebase, or the real time notification feature which requires a backend and a supplemental Android app to communicate with the backend API.

<br>

### License

AGPL-3.0 ©️ Zubin