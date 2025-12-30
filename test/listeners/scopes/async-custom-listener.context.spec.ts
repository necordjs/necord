import { AsyncCustomListenerContext } from '../../../src';

describe('AsyncCustomListenerContext', () => {
	it('should run the callback inside the context and expose the root event', () => {
		const callback = jest.fn(() => {
			const context = AsyncCustomListenerContext.getCurrentContext();
			expect(context.getRootEvent()).toBe('messageCreate');
			return 'result';
		});

		const result = AsyncCustomListenerContext.runInContext('messageCreate', callback);

		expect(result).toBe('result');
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should indicate whether a context is currently attached', () => {
		expect(AsyncCustomListenerContext.isAttached()).toBe(false);

		AsyncCustomListenerContext.runInContext('ready', () => {
			expect(AsyncCustomListenerContext.isAttached()).toBe(true);
		});

		expect(AsyncCustomListenerContext.isAttached()).toBe(false);
	});

	it('should provide a unique context per custom listener execution', () => {
		const firstContext = AsyncCustomListenerContext.runInContext('ready', () =>
			AsyncCustomListenerContext.getCurrentContext()
		);
		const secondContext = AsyncCustomListenerContext.runInContext('guildCreate', () =>
			AsyncCustomListenerContext.getCurrentContext()
		);

		expect(firstContext).not.toBe(secondContext);
		expect(firstContext.getRootEvent()).toBe('ready');
		expect(secondContext.getRootEvent()).toBe('guildCreate');
	});

	it('should throw when accessing a context outside of a listener execution', () => {
		expect(() => AsyncCustomListenerContext.getCurrentContext()).toThrow(
			'No AsyncCustomListenerContext is attached to the current execution context.'
		);
	});
});
