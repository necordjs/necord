import { Arguments, NecordExecutionContext } from '../../../src';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

describe('@Arguments', () => {
	class Test {
		public test(@Arguments() args: string[]) {
			return args;
		}
	}

	const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
	const key = Object.keys(metadata)[0];

	const mockDiscovery = {
		isTextCommand: () => true
	};

	const createMockContext = (message: string): any => {
		return {
			getClass: () => Test,
			getHandler: () => 'test',
			getArgs: () => [[{ content: message }], mockDiscovery],
			getType: () => 'custom'
		};
	};

	it('should enhance parameter with Arguments metadata', () => {
		expect(metadata[key]).toEqual(
			expect.objectContaining({
				index: 0,
				factory: expect.any(Function),
				pipes: [],
				data: undefined
			})
		);
	});

	it('should extract arguments from message content', () => {
		const mockMessage = '!test arg1 arg2 arg3';

		const necordContext = NecordExecutionContext.create(createMockContext(mockMessage));

		const factory = metadata[key].factory;
		const result = factory(undefined, necordContext);
		expect(result).toEqual(['arg1', 'arg2', 'arg3']);
	});

	it('should return null if not a text command', () => {
		const mockMessage = {
			content: '!test arg1 arg2'
		};

		mockDiscovery.isTextCommand = () => false;
		const necordContext = NecordExecutionContext.create(createMockContext(mockMessage.content));

		const factory = metadata[key].factory;
		const result = factory(undefined, necordContext);

		expect(result).toBeNull();
	});
});
