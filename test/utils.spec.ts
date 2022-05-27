import { NestFactory } from '@nestjs/core';
import { Module, Provider } from '@nestjs/common';
import { NecordModule } from '../src';
import { IntentsBitField } from 'discord.js';

export const createApplication = (...providers: Provider[]) => {
	@Module({
		imports: [
			NecordModule.forRoot({
				token: process.env.DISCORD_TOKEN,
				intents: new IntentsBitField([
					'Guilds',
					'DirectMessages',
					'GuildMembers',
					'GuildMessages'
				]),
				development: [process.env.DISCORD_TEST_GUILD]
			})
		],
		providers
	})
	class AppModule {}

	return NestFactory.createApplicationContext(AppModule);
};
