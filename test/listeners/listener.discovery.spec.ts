import { ListenerDiscovery, ListenerMeta } from '../../src';

describe('ListenerDiscovery', () => {
	let discovery: ListenerDiscovery;
	const testMeta: ListenerMeta = { type: 'on', event: 'messageCreate' };

	beforeEach(() => {
		discovery = new ListenerDiscovery(testMeta);
	});

	it('should initialize with provided metadata', () => {
		expect(discovery['meta']).toBe(testMeta);
	});

	it('should set and get discovery metadata', () => {
		const meta = { class: class {}, handler: () => {} };
		discovery.setDiscoveryMeta(meta);
		expect(discovery.getClass()).toBe(meta.class);
		expect(discovery.getHandler()).toBe(meta.handler);
	});

	it('should set and execute context callback', () => {
		const contextCallback = jest.fn((ctx, disc) => ({ ctx, disc }));
		discovery.setContextCallback(contextCallback);

		const context = ['testContext'];
		const result = discovery.execute(context);

		expect(contextCallback).toHaveBeenCalledWith(context, discovery);
		expect(result).toEqual({ ctx: context, disc: discovery });
	});

	it('should identify as ListenerDiscovery', () => {
		expect(discovery.isListener()).toBe(true);
		expect(discovery.isSlashCommand()).toBe(false);
		expect(discovery.isContextMenu()).toBe(false);
		expect(discovery.isMessageComponent()).toBe(false);
		expect(discovery.isTextCommand()).toBe(false);
		expect(discovery.isModal()).toBe(false);
	});
});
