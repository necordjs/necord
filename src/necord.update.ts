import { Injectable, Logger } from '@nestjs/common';
import { Context, On } from './decorators';

@Injectable()
export class NecordUpdate {
	private readonly logger = new Logger(NecordUpdate.name);

	@On('warn')
	public onWarn(@Context() message: string) {
		if (!NecordUpdate.isDebugMode()) {
			return;
		}

		return this.logger.warn(message);
	}

	@On('error')
	public onError(@Context() error: Error) {
		if (!NecordUpdate.isDebugMode()) {
			return;
		}

		return this.logger.error(error);
	}

	@On('debug')
	public onDebug(@Context() message: string) {
		if (!NecordUpdate.isDebugMode()) {
			return;
		}

		return this.logger.debug(message);
	}

	private static isDebugMode(): boolean {
		return !!process.env.NEST_DEBUG;
	}
}
