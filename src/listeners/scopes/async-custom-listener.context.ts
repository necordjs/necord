import { ClientEvents } from 'discord.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { ContextIdFactory } from '@nestjs/core';

const ASYNC_CUSTOM_LISTENER_STORAGE = Symbol('ASYNC_CUSTOM_LISTENER_STORAGE');

export class AsyncCustomListenerContext {
	protected static [ASYNC_CUSTOM_LISTENER_STORAGE] =
		new AsyncLocalStorage<AsyncCustomListenerContext>();

	public readonly id = ContextIdFactory.create();

	public constructor(protected readonly root: keyof ClientEvents) {}

	public static isAttached(): boolean {
		return Boolean(AsyncCustomListenerContext[ASYNC_CUSTOM_LISTENER_STORAGE].getStore());
	}

	public static getCurrentContext(): AsyncCustomListenerContext {
		const context = AsyncCustomListenerContext[ASYNC_CUSTOM_LISTENER_STORAGE].getStore();

		if (!context) {
			throw new Error(
				'No AsyncCustomListenerContext is attached to the current execution context.'
			);
		}

		return context;
	}

	public static runInContext<T>(rootEvent: keyof ClientEvents, callback: () => T): T {
		const context = new AsyncCustomListenerContext(rootEvent);

		return AsyncCustomListenerContext[ASYNC_CUSTOM_LISTENER_STORAGE].run(context, callback);
	}

	public getRootEvent(): keyof ClientEvents {
		return this.root;
	}
}
