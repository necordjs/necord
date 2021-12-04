import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { NecordModuleOptions } from './interfaces';
import { Client } from 'discord.js';
import { MODULE_OPTIONS } from './necord.constants';

@Injectable()
export class NecordClient extends Client implements OnApplicationBootstrap, OnApplicationShutdown {
	public constructor(
		@Inject(MODULE_OPTIONS)
		public readonly options: NecordModuleOptions
	) {
		super(options);
	}

	public onApplicationBootstrap = this.login.bind(this, this.options.token);

	public onApplicationShutdown = this.destroy.bind(this);
}
