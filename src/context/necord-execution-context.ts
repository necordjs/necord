import { ContextType, ExecutionContext } from '@nestjs/common';
import { NecordArgumentsHost } from './necord-arguments-host';

export type NecordContextType = 'necord' | ContextType;

export class NecordExecutionContext extends NecordArgumentsHost {
	public static create(context: ExecutionContext): NecordExecutionContext {
		const type = context.getType();
		const necContext = new NecordExecutionContext(context.getArgs(), context.getClass(), context.getHandler());
		necContext.setType(type);
		return necContext;
	}

	public getType<TContext extends string = NecordContextType>(): TContext {
		return super.getType();
	}

	public getContext<T = any>(): T {
		return this.getArgByIndex(0);
	}
}
