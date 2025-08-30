import { ComponentParam, NecordExecutionContext } from '../../../src';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

describe('@ComponentParam', () => {
	class TestComponentAll {
		public test(@ComponentParam() params: Record<string, any>) {
			return params;
		}
	}

	class TestComponentKey {
		public test(@ComponentParam('a') a: string) {
			return a;
		}
	}

	const componentAllMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestComponentAll, 'test');
	const componentAllKey = Object.keys(componentAllMetadata)[0];

	const componentKeyMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestComponentKey, 'test');
	const componentKey = Object.keys(componentKeyMetadata)[0];

	const createMockContext = (interaction: any, discovery: any): any => ({
		getClass: () => TestComponentAll,
		getHandler: () => 'test',
		getArgs: () => [[interaction], discovery],
		getType: () => 'custom'
	});

	it('should enhance parameter with ComponentParam metadata (all params)', () => {
		expect(componentAllMetadata[componentAllKey]).toEqual(
			expect.objectContaining({
				index: 0,
				factory: expect.any(Function),
				pipes: [],
				data: undefined
			})
		);
	});

	it('should return null if discovery is not message component', () => {
		const interaction = {
			isMessageComponent: () => true,
			componentType: 'Button',
			customId: 'submit'
		};
		const discovery = { isMessageComponent: () => false };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = componentAllMetadata[componentAllKey].factory;
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should return null if interaction is not a message component', () => {
		const interaction = {
			isMessageComponent: () => false,
			componentType: 'Button',
			customId: 'submit'
		};
		const discovery = { isMessageComponent: () => true };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = componentAllMetadata[componentAllKey].factory;
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should return null if matcher does not match', () => {
		const interaction = {
			isMessageComponent: () => true,
			componentType: 'Button',
			customId: 'unknown'
		};
		const discovery = {
			isMessageComponent: () => true,
			matcher: () => null
		};
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = componentAllMetadata[componentAllKey].factory;
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should extract all params from matcher when data is undefined', () => {
		const interaction = {
			isMessageComponent: () => true,
			componentType: 'Button',
			customId: 'submit'
		};
		const matched = { params: { a: '1', b: '2', c: '3' } };
		const discovery = {
			isMessageComponent: () => true,
			matcher: (id: string) => (id === 'Button_submit' ? matched : null)
		};
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = componentAllMetadata[componentAllKey].factory;
		expect(factory(undefined, ctx)).toEqual(matched.params);
	});

	it('should extract a specific param when data key is provided', () => {
		const interaction = {
			isMessageComponent: () => true,
			componentType: 'StringSelect',
			customId: 'choose'
		};
		const matched = { params: { a: 'alpha', b: 'beta' } };
		const discovery = {
			isMessageComponent: () => true,
			matcher: (id: string) => (id === 'StringSelect_choose' ? matched : null)
		};
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = componentKeyMetadata[componentKey].factory;
		expect(factory('a', ctx)).toBe('alpha');
	});
});
