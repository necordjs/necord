import { createCustomOnDecorator, Listener, ListenerDiscovery, On } from '../../../src';

describe('@On', () => {
	class Test {
		@On('ready')
		public execute() {
			return 'Executed';
		}
	}

	it('should be defined', () => {
		expect(On).toBeDefined();
	});

	it('should create a listener with the correct properties', () => {
		const metadata: ListenerDiscovery = Reflect.getMetadata(
			Listener.KEY,
			Test.prototype['execute']
		);

		expect(metadata).toBeInstanceOf(ListenerDiscovery);
		expect(metadata.getType()).toBe('on');
		expect(metadata.getEvent()).toBe('ready');
	});

	it('createCustomOnDecorator() should create a decorator that works like @On', () => {
		interface CustomEvents {
			customEvent: [string, number];
			anotherEvent: [boolean];
		}

		const OnCustom = createCustomOnDecorator<CustomEvents>();

		class CustomTest {
			@OnCustom('customEvent')
			public execute() {
				return 'Executed';
			}
		}

		const metadata: ListenerDiscovery = Reflect.getMetadata(
			Listener.KEY,
			CustomTest.prototype['execute']
		);

		expect(metadata).toBeInstanceOf(ListenerDiscovery);
		expect(metadata.getType()).toBe('on');
		expect(metadata.getEvent()).toBe('customEvent');
	});
});
