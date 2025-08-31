import { IntegerOption, Options, SlashCommand, SlashCommandDiscovery } from '../../../../src';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';

describe('@Options', () => {
	class TestOptions {
		@IntegerOption({ name: 'testInt', description: 'A test integer option', required: true })
		public testInt!: number;
	}

	class Handler {
		@SlashCommand({ name: 'test', description: 'Test command' })
		public execute(@Options() options: TestOptions) {
			return options;
		}
	}

	const handlerMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Handler, 'execute');
	const handlerKey = Object.keys(handlerMetadata)[0];
	const factory = handlerMetadata[handlerKey].factory;

	const slashCommandDiscovery: SlashCommandDiscovery = Reflect.getMetadata(
		SlashCommand.KEY,
		Handler.prototype['execute']
	);
	slashCommandDiscovery.setDiscoveryMeta({
		class: Handler,
		handler: Handler.prototype['execute']
	});

	const createMockContext = (interaction: any): any => ({
		getClass: () => Handler,
		getHandler: () => 'execute',
		getArgs: () => [[interaction], slashCommandDiscovery],
		getType: () => 'custom'
	});

	it('should enhance parameter with Options metadata', () => {
		expect(handlerMetadata[handlerKey]).toEqual(
			expect.objectContaining({
				index: 0,
				factory: expect.any(Function),
				pipes: [],
				data: undefined
			})
		);
	});

	it('should return null if discovery is not slash command', () => {
		const interaction = {
			options: {
				getInteger: jest.fn()
			}
		};
		jest.spyOn(slashCommandDiscovery, 'isSlashCommand').mockReturnValue(false);
		const ctx = createMockContext(interaction);
		expect(factory(undefined, ctx)).toBeNull();
	});

	it('should map interaction options to the options class', () => {
		const interaction = {
			options: {
				getInteger: jest.fn().mockReturnValue(42)
			}
		};

		const ctx = createMockContext(interaction);
		const result = factory(undefined, ctx);
		expect(result).toBeInstanceOf(Object);
		expect(result.testInt).toBe(42);
		expect(interaction.options.getInteger).toHaveBeenCalledWith('testInt', true);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});
});
