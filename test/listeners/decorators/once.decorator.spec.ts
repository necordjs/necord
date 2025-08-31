import { createCustomOnceDecorator, Listener, ListenerDiscovery, Once } from '../../../src';

describe('@Once', () => {
	class Test {
		@Once('ready')
		public execute() {
			return 'Executed';
		}
	}

	it('should be defined', () => {
		expect(Once).toBeDefined();
	});

	it('should create a listener with the correct properties', () => {
		const metadata: ListenerDiscovery = Reflect.getMetadata(
			Listener.KEY,
			Test.prototype['execute']
		);

		expect(metadata).toBeInstanceOf(ListenerDiscovery);
		expect(metadata.getType()).toBe('once');
		expect(metadata.getEvent()).toBe('ready');
	});

	it('createCustomOnceDecorator() should create a decorator that works like @Once', () => {
		interface CustomEvents {
			customEvent: [string, number];
			anotherEvent: [boolean];
		}

		const OnCustom = createCustomOnceDecorator<CustomEvents>();

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
		expect(metadata.getType()).toBe('once');
		expect(metadata.getEvent()).toBe('customEvent');
	});
});
