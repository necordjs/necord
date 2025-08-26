import { NecordBaseDiscovery, SlashCommandDiscovery } from '../../src';

class TestDiscovery extends NecordBaseDiscovery<{ name: string }> {
	public isSlashCommand(): this is SlashCommandDiscovery {
		return true;
	}

	public toJSON(): Record<string, any> {
		return { meta: this['meta'] };
	}
}

describe('NecordBaseDiscovery', () => {
	let discovery: TestDiscovery;

	beforeEach(() => {
		discovery = new TestDiscovery({ name: 'test' });
	});

	it('should have undefined discovery data by default', () => {
		expect(discovery.getClass()).toBeUndefined();
		expect(discovery.getHandler()).toBeUndefined();
	});

	it('setDiscoveryMeta() should set class and handler once', () => {
		const firstMeta = { class: class A {}, handler: () => 'first' };
		discovery.setDiscoveryMeta(firstMeta);
		expect(discovery.getClass()).toBe(firstMeta.class);
		expect(discovery.getHandler()).toBe(firstMeta.handler);

		// Attempt to overwrite — should be ignored
		const secondMeta = { class: class B {}, handler: () => 'second' };
		discovery.setDiscoveryMeta(secondMeta);
		expect(discovery.getClass()).toBe(firstMeta.class);
		expect(discovery.getHandler()).toBe(firstMeta.handler);
	});

	it('setContextCallback() should set callback only once', () => {
		const calls: any[] = [];
		const firstCb = (ctx: any, self: any) => {
			calls.push(['first', ctx, self]);
			return 'first-result';
		};
		const secondCb = (ctx: any, self: any) => {
			calls.push(['second', ctx, self]);
			return 'second-result';
		};

		discovery.setContextCallback(firstCb);
		discovery.setContextCallback(secondCb);

		const res = discovery.execute(['ctx']);
		expect(res).toBe('first-result');
		expect(calls.length).toBe(1);
		expect(calls[0][0]).toBe('first');
		expect(calls[0][1]).toEqual(['ctx']);
		expect(calls[0][2]).toBe(discovery);
	});

	it('execute() should pass context and discovery instance to the callback', () => {
		const seen: any[] = [];
		discovery.setContextCallback((ctx: any, self: any) => {
			seen.push(ctx, self);
			return 42;
		});

		const ctx = { foo: 'bar' };
		const result = discovery.execute(ctx);
		expect(result).toBe(42);
		expect(seen[0]).toBe(ctx);
		expect(seen[1]).toBe(discovery);
	});

	it('type guards: only isSlashCommand() returns true in TestDiscovery', () => {
		expect(discovery.isSlashCommand()).toBe(true);
		expect(discovery.isContextMenu()).toBe(false);
		expect(discovery.isMessageComponent()).toBe(false);
		expect(discovery.isListener()).toBe(false);
		expect(discovery.isTextCommand()).toBe(false);
		expect(discovery.isModal()).toBe(false);
	});

	it('toJSON() should return a serializable representation', () => {
		expect(discovery.toJSON()).toEqual({ meta: { name: 'test' } });
	});
});
