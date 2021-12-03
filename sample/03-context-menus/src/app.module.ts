import { NecordModule } from 'necord';
import { Module } from '@nestjs/common';
import { Intents } from 'discord.js';
import { AppCommands } from './app.commands';

@Module({
	imports: [
		NecordModule.forRoot({
			token: process.env.DISCORD_TOKEN,
			registerApplicationCommands: process.env.DEV_GUILD,
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]
		})
	],
	providers: [AppCommands]
})
export class AppModule {}
