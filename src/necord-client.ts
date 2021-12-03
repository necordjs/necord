import { Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { NecordModuleOptions } from './interfaces';
import { ApplicationCommandData, BaseMessageComponent, Client } from 'discord.js';
import { APPLICATION_COMMANDS, MESSAGE_COMPONENTS, MODULE_OPTIONS } from './providers';
import { On } from './decorators';

@Injectable()
export class NecordClient extends Client implements OnApplicationBootstrap, OnApplicationShutdown {
	private readonly logger = new Logger(NecordClient.name);

	public constructor(
		@Inject(MODULE_OPTIONS)
		public readonly options: NecordModuleOptions,
		@Inject(APPLICATION_COMMANDS)
		public readonly applicationCommands: ApplicationCommandData[],
		@Inject(MESSAGE_COMPONENTS)
		public readonly messageComponents: BaseMessageComponent[]
	) {
		super(options);
	}

	public onApplicationBootstrap = this.login.bind(this, this.options.token);

	public onApplicationShutdown = this.destroy.bind(this);

	@On('ready')
	private async onReadyRegistration() {
		if (!this.options.registerApplicationCommands) {
			return;
		}

		if (this.application.partial) {
			await this.application.fetch();
		}

		this.logger.log(`Started refreshing application commands.`);
		await this.application.commands.set(
			this.applicationCommands,
			typeof this.options.registerApplicationCommands === 'string'
				? this.options.registerApplicationCommands
				: undefined
		);
		this.logger.log(`Successfully reloaded application commands.`);
	}
}
