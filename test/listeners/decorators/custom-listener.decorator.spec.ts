import { CustomListener, CustomListenerHandler } from '../../../src';

@CustomListener('messageCreate')
class CustomListenerHandlerTest {
	@CustomListenerHandler()
	handleEvent(args: any[]) {
		return args;
	}
}

describe('@CustomListener', () => {
	it('should be defined', () => {
		expect(CustomListener).toBeDefined();
	});

	it('should create a listener with the correct properties', () => {
		const metadata: string = Reflect.getMetadata(CustomListener.KEY, CustomListenerHandlerTest);

		expect(metadata).toBe('messageCreate');
	});
});

describe('@CustomListenerHandler', () => {
	it('should be defined', () => {
		expect(CustomListenerHandler).toBeDefined();
	});

	it('should mark the method as a custom listener handler', () => {
		const metadata: boolean = Reflect.getMetadata(
			CustomListenerHandler.KEY,
			CustomListenerHandlerTest.prototype['handleEvent']
		);

		expect(metadata).toBe(true);
	});
});
