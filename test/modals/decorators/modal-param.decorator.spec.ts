import { ModalParam, NecordExecutionContext } from '../../../src';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

describe('@ModalParam', () => {
	class TestModalAll {
		public test(@ModalParam() params: Record<string, any>) {
			return params;
		}
	}

	class TestModalKey {
		public test(@ModalParam('a') a: string) {
			return a;
		}
	}

	const modalAllMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestModalAll, 'test');
	const modalAllKey = Object.keys(modalAllMetadata)[0];

	const modalKeyMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestModalKey, 'test');
	const modalKey = Object.keys(modalKeyMetadata)[0];

	const createMockContext = (interaction: any, discovery: any): any => ({
		getClass: () => TestModalAll,
		getHandler: () => 'test',
		getArgs: () => [[interaction], discovery],
		getType: () => 'custom'
	});

	it('should enhance parameter with ModalParam metadata (all params)', () => {
		expect(modalAllMetadata[modalAllKey]).toEqual(
			expect.objectContaining({
				index: 0,
				factory: expect.any(Function),
				pipes: [],
				data: undefined
			})
		);
	});

	it('should return null if discovery is not modal', () => {
		const interaction = { isModalSubmit: () => true, customId: 'modal:test' };
		const discovery = { isModal: () => false };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = modalAllMetadata[modalAllKey].factory;
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should return null if interaction is not a modal submit', () => {
		const interaction = { isModalSubmit: () => false, customId: 'modal:test' };
		const discovery = { isModal: () => true };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = modalAllMetadata[modalAllKey].factory;
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should return null if matcher does not match', () => {
		const interaction = { isModalSubmit: () => true, customId: 'modal:unknown' };
		const discovery = { isModal: () => true, matcher: () => null };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = modalAllMetadata[modalAllKey].factory;
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should extract all params from matcher when data is undefined', () => {
		const interaction = { isModalSubmit: () => true, customId: 'modal:submit' };
		const matched = { params: { a: '1', b: '2', c: '3' } };
		const discovery = {
			isModal: () => true,
			matcher: (id: string) => (id === 'modal:submit' ? matched : null)
		};
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = modalAllMetadata[modalAllKey].factory;
		expect(factory(undefined, ctx)).toEqual(matched.params);
	});

	it('should extract a specific param when data key is provided', () => {
		const interaction = { isModalSubmit: () => true, customId: 'modal:submit' };
		const matched = { params: { a: 'alpha', b: 'beta' } };
		const discovery = { isModal: () => true, matcher: () => matched };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = modalKeyMetadata[modalKey].factory;
		expect(factory('a', ctx)).toBe('alpha');
	});
});
