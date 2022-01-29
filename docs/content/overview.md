---
id: overview

slug: /overview

title: Overview

sidebar_position: 2
---

### Language

We're in love with [TypeScript](https://www.typescriptlang.org/), but above all - we love [Node.js](https://nodejs.org/en/). That's why
Necord is compatible with both TypeScript and **pure JavaScript**. Necord takes advantage of the latest language features, so to use it with
vanilla JavaScript we need a [Babel](https://babeljs.io/) compiler.

We'll mostly use TypeScript in the examples we provide, but you can always **switch the code snippets** to vanilla JavaScript syntax (simply
click to toggle the language button in the upper right hand corner of each snippet).

### Prerequisites

Please make sure that [Node.js](https://nodejs.org/en/) (>= 16.6.0) is installed on your operating system.

### Installating Nest.js

Setting up a new project is quite simple with the [Nest CLI](https://docs.nestjs.com/cli/overview). With [npm](https://www.npmjs.com/)
installed, you can create a new Nest project with the following commands in your OS terminal:

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
$ cd project-name
```

The `project-name` directory will be created, node modules and a few other boilerplate files will be installed, and a `src/` directory will
be created and populated with several core files.

The `main.ts` includes an async function, which will **bootstrap** our application:

```typescript title="src/main.ts"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}

bootstrap();
```

### Installating Necord

Install **Necord** using the following commands in your OS terminal:

```bash npm2yarn
$ npm install necord discord.js
```

### Module Configuration

:::tip

Global commands are cached for one hour. New global commands will fan out slowly across all guilds and will only be guaranteed to be updated
after an hour. Guild commands update instantly. As such, we recommend you use guild-based commands during development and publish them to
global commands when they're ready for public use. Use `development` property for register guild-based commands when you need dev
enviroment.

:::

:::note

`Development` key will only be apply to commands with no `@Guilds` decorator: If a command already has a guild registered, this will _not_
replace it.

:::

Once the installation process is complete, we can import the `NecordModule` into the root `AppModule`:

```typescript title="src/app.module.ts"
import { NecordModule } from 'necord';
import { Module } from '@nestjs/common';
import { Intents } from 'discord.js';

@Module({
    imports: [
        NecordModule.forRoot({
            token: 'DISCORD_BOT_TOKEN',
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
            development: ['DISCORD_DEV_GUILD_ID']
        })
    ],
    providers: []
})
export class AppModule {
}
```

:::info

You need to set up **[intents](https://discordjs.guide/popular-topics/intents.html#privileged-intents)** for the application to work
properly.

:::

### Setting Listeners

Then create `app.update.ts` file and add `On`/`Once` decorators for handling Discord API events:

```typescript title="src/app.update.ts"
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

### Text Commands

:::caution

A text command is dependent on the content of the message but unfortunately, Discord plans to remove message content for verified bots and
apps, those with 100 or more servers. Hence, You cannot use text commands if your bot cannot access message content.

[Read discord message here](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Access-Deprecation-for-Verified-Bots)

:::

Create a simple command handler for messages using `@TextCommand`.

```typescript title="src/app.commands.ts"
@Injectable()
export class AppUpdate {
...

    @TextCommand('ping')
    public onPing(@Context() [message]: ContextOf<'messageCreate'>, @Options() options: string[]) {
        return message.reply('pong!');
    }

...
}
```

If all goes well, you should see something like this:

![Text Command](https://i.imgur.com/qEMm6xj.png)

### Running the application

You can run the following command at your OS command prompt to start the application listening Discord API events:

```bash npm2yarn
$ npm run start
```
