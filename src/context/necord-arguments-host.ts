import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ArgumentsHost } from '@nestjs/common';
import { NecordContextType } from './necord-execution-context';

export interface INecordArgumentsHost extends ArgumentsHost {
	getContext<T = any>(): T;

	getOptions<T = any>(): T;
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

	public getOptions<T = any>(): T {
		return this.getArgByIndex(1);
	}
}
