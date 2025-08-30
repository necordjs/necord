import { ParamData } from '@nestjs/common';
import { NecordParamsFactory, NecordParamType, NecordBaseDiscovery } from '../../src';

class TestDiscovery extends NecordBaseDiscovery<{ name?: string }> {
	public toJSON() {
		return { meta: this['meta'] };
	}
}

describe('NecordParamsFactory', () => {
	let factory: NecordParamsFactory;
	let context: any[];
	let discovery: NecordBaseDiscovery<any>;

	beforeEach(() => {
		factory = new NecordParamsFactory();
		context = [{ foo: 'bar' }, 'ctx2'];
		discovery = new TestDiscovery({ name: 'd1' });
	});

	it('should return null when args is undefined', () => {
		const res = factory.exchangeKeyForValue(
			NecordParamType.CONTEXT,
			undefined as unknown as ParamData,
			undefined as any
		);
		expect(res).toBeNull();
	});

	it('should map CONTEXT to args[0]', () => {
		const res = factory.exchangeKeyForValue(
			NecordParamType.CONTEXT,
			undefined as unknown as ParamData,
			[context, discovery]
		);
		expect(res).toBe(context);
	});

	it('should map DISCOVERY to args[1]', () => {
		const res = factory.exchangeKeyForValue(
			NecordParamType.DISCOVERY,
			undefined as unknown as ParamData,
			[context, discovery]
		);
		expect(res).toBe(discovery);
	});

	it('should return null for unknown param type', () => {
		const res = factory.exchangeKeyForValue(999 as any, undefined as unknown as ParamData, [
			context,
			discovery
		]);
		expect(res).toBeNull();
	});

	it('should ignore ParamData argument (kept for signature compatibility)', () => {
		const data = 'any-param-data' as unknown as ParamData;
		const res1 = factory.exchangeKeyForValue(NecordParamType.CONTEXT, data, [
			context,
			discovery
		]);
		const res2 = factory.exchangeKeyForValue(NecordParamType.DISCOVERY, data, [
			context,
			discovery
		]);
		expect(res1).toBe(context);
		expect(res2).toBe(discovery);
	});
});
