import { Context, Discovery, NecordParamType } from '../../../src';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

class Cls {
	method(@Discovery() context: any) {}
}

describe('@Discovery', () => {
	const getMeta = (target: any, methodName: string) => {
		const meta = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, methodName);
		const key = Object.keys(meta)[0];
		return { meta, key };
	};

	it('should enhance parameter with factory and defaults', () => {
		const { meta, key } = getMeta(Cls, 'method');

		expect(meta[key]).toEqual(
			expect.objectContaining({
				index: 0,
				pipes: []
			})
		);
	});

	it('should have a necord param type associated', () => {
		const { key } = getMeta(Cls, 'method');
		const [paramType] = key.split(':');

		expect(+paramType).toBe(NecordParamType.DISCOVERY);
	});
});
