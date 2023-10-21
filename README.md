# Discord FOTD selfbot

A simple selfbot to post fact of the day on a discord server..

![example](https://i.imgur.com/MkrS8Rr.png)
![!start](https://i.imgur.com/mwdbIUN.png)
![finsihed](https://i.imgur.com/o64WjI7.png)
![list](https://i.imgur.com/pTLz4bp.png)

## Features

- Facts suggestion for you to choose from.
- Auto duplicate detection.
- that's it ig..

## Table on contents

- [Discord FOTD selfbot](#discord-fotd-selfbot)
  - [Features](#features)
- [Setup](#setup)
  - [24/7](#247)
  - [Commands](#commands)
  - [Important stuff](#important-stuff)

# Setup

[![Run on Repl.it](https://repl.it/badge/github/xharuke/fotd-selfbot)](https://repl.it/github/xHaruke/fotd-selfbot)

- Click the button above

- Edit config.js

![sectrets](https://i.imgur.com/N1bha6v.png)

- Click `Secrets` > `New Secret` > Put `token` in `key` and your token in `Value` > Click `Add Secret`

![di](https://i.imgur.com/RHlNHTv.png)

- Click run

## 24/7

- Click the run button and copy the url

![24/7 Url](https://i.imgur.com/iCJe8GI.png)

- Go to [Uptime Robot](https://uptimerobot.com/dashboard) > Click add a new monitor > Set monitor type to `HTTP(s)` > Give it a name > Enter the url in the `URL (or IP)` > Set monitoring interval to 1 minute > Click create monitor

![Uptime Robot](https://i.imgur.com/eTlKgrZ.png)

## Commands

- `{prefix}start` - Start the collection.
- `{pefix}customfact [fact]` - Set a custom fact.
- `{pefix}list` - List all the facts that are to be sent.
- `{prefix}forcepost` - Forcepost a fact at the time of running this command.
- `{prefix}pause` - Stop the bot from posting facts until this command this ran again.

## Important stuff

- This is a selfbot which is against discord's dumb rules.
- This project was made for fun so the code isn't that good.
- This project can run with both node and bun(yes the shit that that is 29x faster than npm).

## Make sure to add a ⭐ if you are using the bot
