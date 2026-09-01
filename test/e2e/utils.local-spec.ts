import { Module, Provider } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { NecordModule } from '../../src/index.js';

export const createApplication = (...providers: Provider[]) => {
	const token = process.env.DISCORD_TOKEN;
	const testGuild = process.env.DISCORD_TEST_GUILD;

	if (!token) {
		throw new Error('DISCORD_TOKEN is required to run the local E2E application.');
	}

	if (!testGuild) {
		throw new Error('DISCORD_TEST_GUILD is required to run the local E2E application.');
	}

	@Module({
		imports: [
			NecordModule.forRoot({
				token,
				intents: [
					'Guilds',
					'GuildMembers',
					'GuildMessages',
					'MessageContent',
					'GuildVoiceStates'
				],
				prefix: '!',
				development: [testGuild]
			})
		],
		providers
	})
	class AppModule {}

	void NestFactory.createApplicationContext(AppModule);
};
