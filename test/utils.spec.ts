import { NestFactory } from '@nestjs/core';
import { Module, Provider, Type } from '@nestjs/common';
import { NecordModule } from '../src';
import { Intents } from 'discord.js';

export const createApplication = (...providers: (Type | Provider)[]) => {
	@Module({
		imports: [
			NecordModule.forRoot({
				token: process.env.DISCORD_TOKEN,
				intents: Object.values(Intents.FLAGS).reduce((acc, val) => acc | val, 0),
				development: [process.env.DISCORD_TEST_GUILD]
			})
		],
		providers
	})
	class AppModule {}

	return NestFactory.createApplicationContext(AppModule);
};
