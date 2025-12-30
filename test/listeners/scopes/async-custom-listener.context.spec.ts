import { AsyncCustomListenerContext } from '../../../src';

describe('AsyncCustomListenerContext', () => {
	it('should run the callback inside the context and expose the root event and args', () => {
		const callback = jest.fn(() => {
			const context = AsyncCustomListenerContext.getCurrentContext();
			expect(context.getRootEvent()).toBe('messageCreate');
			expect(context.getRootArgs()).toEqual(['payload']);
			return 'result';
		});

		const result = AsyncCustomListenerContext.runInContext(
			{
				root: 'messageCreate',
				args: ['payload']
			},
			callback
		);

		expect(result).toBe('result');
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should indicate whether a context is currently attached', () => {
		expect(AsyncCustomListenerContext.isAttached()).toBe(false);

		AsyncCustomListenerContext.runInContext(
			{
				root: 'ready',
				args: []
			},
			() => {
				expect(AsyncCustomListenerContext.isAttached()).toBe(true);
			}
		);

		expect(AsyncCustomListenerContext.isAttached()).toBe(false);
	});

	it('should provide a unique context per custom listener execution', () => {
		const firstContext = AsyncCustomListenerContext.runInContext(
			{
				root: 'ready',
				args: ['foo']
			},
			() => AsyncCustomListenerContext.getCurrentContext()
		);
		const secondContext = AsyncCustomListenerContext.runInContext(
			{
				root: 'guildCreate',
				args: ['bar']
			},
			() => AsyncCustomListenerContext.getCurrentContext()
		);

		expect(firstContext).not.toBe(secondContext);
		expect(firstContext.getRootEvent()).toBe('ready');
		expect(firstContext.getRootArgs()).toEqual(['foo']);
		expect(secondContext.getRootEvent()).toBe('guildCreate');
		expect(secondContext.getRootArgs()).toEqual(['bar']);
	});

	it('should throw when accessing a context outside of a listener execution', () => {
		expect(() => AsyncCustomListenerContext.getCurrentContext()).toThrow(
			'No AsyncCustomListenerContext is attached to the current execution context.'
		);
	});
});
