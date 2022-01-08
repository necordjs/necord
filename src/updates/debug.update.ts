import { Inject, Injectable, Logger } from '@nestjs/common';
import { Context, On } from '../decorators';
import { ContextOf, NecordModuleOptions } from '../interfaces';
import { NECORD_MODULE_OPTIONS } from '../necord.constants';

@Injectable()
export class DebugUpdate {
	private readonly logger = new Logger(DebugUpdate.name);

	public constructor(
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions
	) {}

	@On('warn')
	public onWarn(@Context() [message]: ContextOf<'warn'>) {
		if (!this.isDebugMode()) {
			return;
		}

		return this.logger.warn(message);
	}

	@On('error')
	public onError(@Context() [error]: ContextOf<'error'>) {
		if (!this.isDebugMode()) {
			return;
		}

		return this.logger.error(error);
	}

	@On('debug')
	public onDebug(@Context() [message]: ContextOf<'debug'>) {
		if (!this.isDebugMode()) {
			return;
		}

		return this.logger.debug(message);
	}

	private isDebugMode(): boolean {
		return typeof this.options.debug === 'boolean'
			? !!this.options.debug
			: !!process.env.NEST_DEBUG;
	}
}
