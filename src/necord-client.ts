import { Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { MODULE_OPTIONS } from './necord.constants';
import { NecordModuleOptions } from './interfaces';
import { Client as DiscordClient } from 'discord.js';
import { OnDebug, OnError, OnReady, OnWarn } from './decorators';

@Injectable()
export class NecordClient extends DiscordClient implements OnApplicationBootstrap, OnApplicationShutdown {
	private readonly logger = new Logger(NecordClient.name);

	public constructor(
		@Inject(MODULE_OPTIONS)
		private readonly necordOptions: NecordModuleOptions
	) {
		super(necordOptions);
	}

	public onApplicationBootstrap() {
		return this.login(this.necordOptions.token);
	}

	public onApplicationShutdown() {
		return this.destroy();
	}

	@OnReady
	public async onReady() {
		this.logger.log(`Logged In...`);
	}

	@OnDebug
	public onDebug(message: string) {
		this.logger.debug(message);
	}

	@OnWarn
	public onWarn(message: string) {
		this.logger.warn(message);
	}

	@OnError
	public onError(err: Error) {
		this.logger.error(err.message, err.stack);
	}
}
