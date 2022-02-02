---
id: first-steps

title: First Steps

sidebar_position: 1
---

## First Steps
In this article, you'll learn about the basics of necord, and how it integrates with [NestJS](https://nestjs.com/)!

:::tip

Many of the concepts seen with necord are designed to be used like other components in a [NestJS](https://nestjs.com/) project.  
We recommend you to be familiar with the [NestJS documentation](https://docs.nestjs.com/), especially its [overview](https://docs.nestjs.com/first-steps) section, before getting started.

:::

The very first step is to install necord and its dependency, [`Discord.js`](https://discord.js.org)
```bash npm2yarn
npm install necord discord.js
```

## Module 

Necord is a module like any others, and can be imported as such within your Nest application.

:::note NestJS modules

Not sure what modules are? Catch up by reading about them in [NestJS](https://docs.nestjs.com/modules)!

:::

```typescript title="discord.module.ts"
import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Module({
  imports: [
    NecordModule.forRoot({
        token: process.env.DISCORD_TOKEN,
        intents: [
            Intents.FLAGS.GUILDS,
        ],
        development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID],
    }),
  ],
  providers: [DiscordService],
})
export class DiscordModule {}
```

:::info

Make sure to setup the correct **[intents](https://discordjs.guide/popular-topics/intents.html#privileged-intents)** required by your application!

:::

The module arguments are an extension of discord.js [ClientOptions](https://discord.js.org/#/docs/discord.js/stable/typedef/ClientOptions), in addition to 3 necord options: `token`, `prefix` and `development`.
```ts
export interface NecordModuleOptions extends DiscordClientOptions {
    token: string;
    prefix?: string | (message: Message) => string | Promise<string>;
    development?: Snowflake[];
}
```
### Token
`token` is your Discord token: it is used to authenticate as your bot.
### Prefix 
If you are using `TextCommand`, you can specify the prefix here.
It can be a string for a static prefix, or a function which returns a string based off the message being sent.
If using a function, it can be asynchronous.

### Development
As discord caches application commands for up to an hour, it is recommended to specify a development guild when doing development.
If you do not specify a development guild, your commands and their arguments are likely to be outdated.

:::caution Warning

If you have commands using the `@Guilds` decorator, the global development argument **will not** overwrite it.  

:::

## Structure
As Necord follows the NestJS structure, the various discord components available must be imported as providers.

:::info

In this section of the guide, all of the code will be in the `discord.service.ts` file, but for a real application you should separate them into their own components such as `discord.update.ts` and `ping.command.ts`.

:::

```ts title="discord.service.ts"
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscordService {
    // Your code here
}
```

## Event handlers
Necord supports interacting with all [discord events](https://discord.js.org/#/docs/main/stable/class/Client#Events) via the `@On` and `@Once` decorator.  
While the best practice is to use the more specific decorators when possible, this is useful if you wish to use features Necord doesn't support via custom decorators, to interact with the raw requests, or to listen to all events using a decorator such as `interactionCreate`.

```typescript title="discord.service.ts"
import { Injectable, Logger } from '@nestjs/common';
import { Once, On, Context, ContextOf } from 'necord';

@Injectable()
export class DiscordService {
    private readonly logger = new Logger(DiscordService.name);

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

:::caution Warning

If you use global filters, guards or interceptors, they will be triggered once per event!  
This means if you are replying to the message in guards, you can run into issues with duplicated responses or invalid interactions.
Have a look at the `NecordExecutionContext.getInfo()` metadata to learn more about the current context.

:::

## Context
You might have noticed the `@Context` decorator in the last snippet: This is used to inject the event context within the method.
As there are many type of events, its type must be inferred from the `ContextOf<type: string>` type.

You can access the context variables by using the `@Context()` decorator within your function, which will populate the variable with an array of arguments.

## Commands

The best way to interact with your users is to use [Slash commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ)!
Slash commands allow you to create commands with precise arguments and choices, giving users the best experience. 

To create a command with Necord, you can use the `SlashCommand` decorator.

```typescript title="discord.service.ts"
import { Injectable } from '@nestjs/common';
import { Context, ContextOf, SlashCommand } from 'necord';

@Injectable()
export class DiscordService {
    @SlashCommand("ping", "Ping command!")
    public async onPing(
        @Context() [interaction]: ContextOf<"slashCommand">
    ) {
        return interaction.reply({ content: "Pong!" });
    }
}
```

:::tip

When the client logs in, it will automatically register all of the commands.
Global commands are cached for up to an hour, therefore to avoid the global commands cache, you should use the `development` argument on the Necord module. This will restrict the command to a single guild, preventing it from getting caught by the cache.

:::