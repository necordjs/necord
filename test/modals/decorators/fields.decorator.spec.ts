import { Fields, NecordExecutionContext } from '../../../src';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

describe('@Fields', () => {
	class TestFieldsAll {
		public test(@Fields() fields: any) {
			return fields;
		}
	}

	class TestFieldsKey {
		public test(@Fields('username') username: string) {
			return username;
		}
	}

	const allMeta = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestFieldsAll, 'test');
	const allKey = Object.keys(allMeta)[0];

	const keyMeta = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestFieldsKey, 'test');
	const keyKey = Object.keys(keyMeta)[0];

	const createMockContext = (interaction: any, discovery: any): any => {
		return {
			getClass: () => TestFieldsAll,
			getHandler: () => 'test',
			getArgs: () => [[interaction], discovery],
			getType: () => 'custom'
		};
	};

	it('should enhance parameter with Fields metadata (all)', () => {
		expect(allMeta[allKey]).toEqual(
			expect.objectContaining({
				index: 0,
				factory: expect.any(Function),
				pipes: [],
				data: undefined
			})
		);
	});

	it('should return null if not a modal discovery', () => {
		const interaction = { isModalSubmit: () => true, fields: {} };
		const discovery = { isModal: () => false };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = allMeta[allKey].factory;
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should return null if interaction is not a modal submit', () => {
		const interaction = { isModalSubmit: () => false, fields: {} };
		const discovery = { isModal: () => true };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = allMeta[allKey].factory;
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should return all fields when data is undefined', () => {
		const fieldsObj = { getTextInputValue: (id: string) => ({})[id], any: 'value' } as any;
		const interaction = { isModalSubmit: () => true, fields: fieldsObj };
		const discovery = { isModal: () => true };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = allMeta[allKey].factory;
		expect(factory(undefined, ctx)).toBe(fieldsObj);
	});

	it('should return a specific field by customId when data is provided', () => {
		const values: Record<string, string> = {
			username: 'socketsomeone',
			email: 'socket.someone@gmail.com'
		};
		const fieldsObj = { getTextInputValue: (id: string) => values[id] } as any;
		const interaction = { isModalSubmit: () => true, fields: fieldsObj };
		const discovery = { isModal: () => true };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = keyMeta[keyKey].factory;
		expect(factory('username', ctx)).toBe('socketsomeone');
	});
});
