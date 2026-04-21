import { ModalComponents, NecordExecutionContext } from '../../../src';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

describe('@ModalComponents', () => {
	class TestComponentsAll {
		public test(@ModalComponents() components: any) {
			return components;
		}
	}

	class TestComponentsKey {
		public test(@ModalComponents('username') username: string) {
			return username;
		}
	}

	const allMeta = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestComponentsAll, 'test');
	const allKey = Object.keys(allMeta)[0];

	const keyMeta = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestComponentsKey, 'test');
	const keyKey = Object.keys(keyMeta)[0];

	const createMockContext = (interaction: any, discovery: any): any => {
		return {
			getClass: () => TestComponentsAll,
			getHandler: () => 'test',
			getArgs: () => [[interaction], discovery],
			getType: () => 'custom'
		};
	};

	it('should enhance parameter with ModalComponents metadata (all)', () => {
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
		const interaction = { isModalSubmit: () => true, components: {} };
		const discovery = { isModal: () => false };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = allMeta[allKey].factory;
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should return null if interaction is not a modal submit', () => {
		const interaction = { isModalSubmit: () => false, components: {} };
		const discovery = { isModal: () => true };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = allMeta[allKey].factory;
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should return all components when data is undefined', () => {
		const componentsObj = { getComponent: (id: string) => ({})[id], any: 'value' } as any;
		const interaction = { isModalSubmit: () => true, components: componentsObj };
		const discovery = { isModal: () => true };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = allMeta[allKey].factory;
		expect(factory(undefined, ctx)).toBe(componentsObj);
	});

	it('should return a specific component by customId when data is provided', () => {
		const componentData = { type: 4, customId: 'username', value: 'socketsomeone' };
		const componentsObj = {
			getComponent: (id: string) => (id === 'username' ? componentData : null)
		} as any;
		const interaction = { isModalSubmit: () => true, components: componentsObj };
		const discovery = { isModal: () => true };
		const ctx = NecordExecutionContext.create(createMockContext(interaction, discovery));
		const factory = keyMeta[keyKey].factory;
		expect(factory('username', ctx)).toBe(componentData);
	});
});
