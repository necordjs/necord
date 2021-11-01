import { Injectable, Logger } from '@nestjs/common';
import { ApplicationCommandsService, Context, NecordClient, OnReady } from 'necord';
import { Client } from 'discord.js';

@Injectable()
export class AppUpdate {
	private readonly logger = new Logger(AppUpdate.name);

	public constructor(
		private readonly necordClient: NecordClient,
		private readonly commandsService: ApplicationCommandsService
	) {}

	@OnReady
	public async onReady(@Context() client: Client) {
		this.logger.log(`Bot logged in as ${client.user.username}`);
		this.logger.log('Started refreshing application (/) commands.');
		await client.application.commands.set(this.commandsService.getApplicationCommands(), process.env.DEV_GUILD);
		this.logger.log('Successfully reloaded application (/) commands.');
	}
}
