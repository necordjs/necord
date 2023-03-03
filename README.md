<div align="center">
   <h1>
       <a href="#"><img src="https://necord.org/img/logo.png" alt ="Necord Logo"></a>
   </h1>
   🤖 A module for creating <b><a href="https://discord.com/">Discord</a> bots</b> using <a href="https://nestjs.com">NestJS</a>, based on <a href="https://discord.js.org/">Discord.js</a>
   <br/><br/>
   <a href="https://necord.org">Documentation ✨</a> &emsp; <a href="https://github.com/necordjs/necord">Source code 🪡</a> &emsp; <a href="https://github.com/necordjs/samples">Examples 🛠️</a> &emsp; <a href="https://discord.gg/mcBYvMTnwP">Community 💬</a>
</div>


<br/>

<p align="center">
    <a href='https://img.shields.io/npm/v/necord'><img src="https://img.shields.io/npm/v/necord" alt="NPM Version" /></a>
    <a href='https://img.shields.io/npm/l/necord'><img src="https://img.shields.io/npm/l/necord" alt="NPM License" /></a>
    <a href='https://img.shields.io/npm/dm/necord'><img src="https://img.shields.io/npm/dm/necord" alt="NPM Downloads" /></a>
    <a href='https://img.shields.io/github/last-commit/necordjs/necord'><img src="https://img.shields.io/github/last-commit/SocketSomeone/necord" alt="Last commit" /></a>
</p>


## About

This package uses the best of the NodeJS world under the hood. [Discord.js](https://github.com/discordjs/discord.js) is the most powerful
library for creating bots and [Nest.js](https://github.com/nestjs) is a progressive framework for creating well-architectured applications.
This module provides fast and easy way for creating Discord bots and deep integration with your NestJS application.

**Features**

- Simple. Flexible. Easy to use.
- Ability to create custom decorators.
- Interact with Discord (Slash Commands, Context Menus, Message Components, Listeners).
- Full support of NestJS guards, interceptors, filters and pipes!

For questions and support please use
the [Issues](https://github.com/necordjs/necord/issues/new?assignees=&labels=question&template=question.yml).

## Installation

**Node.js 16.6.0 or newer is required.**

```bash
$ npm i necord discord.js
$ yarn add necord discord.js
$ pnpm add necord discord.js
```

## Usage

Once the installation process is complete, we can import the `NecordModule` into the root `AppModule`:

```typescript
import { NecordModule } from 'necord';
import { Module } from '@nestjs/common';
import { Intents } from 'discord.js';

@Module({
    imports: [
        NecordModule.forRoot({
            token: 'DISCORD_BOT_TOKEN',
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]
        })
    ],
    providers: []
})
export class AppModule {
}
```

Then create `app.update.ts` file and add `On`/`Once` decorators for handling Discord API events:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Context, On, Once, ContextOf } from 'necord';
import { Client } from 'discord.js';

@Injectable()
export class AppUpdate {
    private readonly logger = new Logger(AppUpdate.name);

    public constructor(private readonly client: Client) {
    }
    
    @Once('ready')
    public onReady(@Context() [client]: ContextOf<'ready'>) {
        this.logger.log(`Bot logged in as ${client.user.username}`);
    }

    @On('warn')
    public onWarn(@Context() [message]: ContextOf<'warn'>) {
        this.logger.warn(message);
    }
}
```

Whenever you need to handle any event data, use the `Context` decorator.

If you want to fully dive into Necord check out these resources:

* [Necord Wiki](https://necord.org) - Official documentation of Necord.
* [Nest JS](https://docs.nestjs.com) - A progressive framework for creating well-architectured applications.
* [Discord JS](https://discord.js.org) - The most powerful library for creating bots.
* [Discord API](https://discord.com/developers/docs) - Official documentation of Discord API.

## Stay in touch

* Author - [Alexey Filippov](https://t.me/socketsomeone)
* Twitter - [@SocketSomeone](https://twitter.com/SocketSomeone)

## License

[MIT](https://github.com/necordjs/necord/blob/master/LICENSE) © [Alexey Filippov](https://github.com/SocketSomeone)
