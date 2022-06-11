import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ArgumentsHost } from '@nestjs/common';
import { NecordContextType } from './necord-execution-context';
import { ClientEvents } from 'discord.js';
import { NecordBaseDiscovery } from '../context';
import { ContextOf } from './necord-context.interface';

export class NecordArgumentsHost extends ExecutionContextHost {
	public static create(context: ArgumentsHost): NecordArgumentsHost {
		const type = context.getType();
		const necContext = new NecordArgumentsHost(context.getArgs());
		necContext.setType(type);
		return necContext;
	}

	public getType<TContext extends string = NecordContextType>(): TContext {
		return super.getType();
	}

	public getContext<T extends keyof ClientEvents>(): ContextOf<T>;
	public getContext<T>(): T;
	public getContext<T extends keyof ClientEvents>(): ContextOf<T> {
		return this.getArgByIndex(0);
	}

	public getDiscovery(): NecordBaseDiscovery {
		return this.getArgByIndex(1);
	}
}
