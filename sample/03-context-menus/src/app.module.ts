import { NecordModule } from 'necord';
import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { Intents } from 'discord.js';
import { AppCommands } from './app.commands';

@Module({
	imports: [
		NecordModule.forRoot({
			token: process.env.DISCORD_TOKEN,
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]
		})
	],
	providers: [AppUpdate, AppCommands]
})
export class AppModule {}
