import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ArgumentsHost } from '@nestjs/common';
import { NecordContextType } from './necord-execution-context';
import { CommandInteractionOptionResolver } from 'discord.js';

export interface INecordArgumentsHost extends ArgumentsHost {
	getContext<T = any>(): T;
}

export class NecordArgumentsHost extends ExecutionContextHost implements INecordArgumentsHost {
	public static create(context: ArgumentsHost): NecordArgumentsHost {
		const type = context.getType();
		const necContext = new NecordArgumentsHost(context.getArgs());
		necContext.setType(type);
		return necContext;
	}

	public getType<TContext extends string = NecordContextType>(): TContext {
		return super.getType();
	}

	public getContext<T = any>(): T {
		return this.getArgByIndex(0);
	}

	public getValue() {
		return this.getArgByIndex(1);
	}

	public getValues(): string[] {
		return this.getArgByIndex(2);
	}

	public getOptions(): CommandInteractionOptionResolver {
		return this.getArgByIndex(3);
	}
}
