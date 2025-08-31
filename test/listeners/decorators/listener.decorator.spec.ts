import { Listener, ListenerDiscovery } from '../../../src';

describe('@Listener', () => {
	class TestListener {
		@Listener({ event: 'testEvent', type: 'on' })
		handleTestEvent() {
			// handle the event
		}
	}

	it('should be defined', () => {
		expect(Listener).toBeDefined();
		expect(Listener.KEY).toBeDefined();
	});

	it('should attach metadata to the method', () => {
		const metadata: ListenerDiscovery = Reflect.getMetadata(
			Listener.KEY,
			TestListener.prototype['handleTestEvent']
		);

		expect(metadata).toBeDefined();
		expect(metadata).toBeInstanceOf(ListenerDiscovery);
		expect(metadata.getEvent()).toBe('testEvent');
		expect(metadata.getType()).toBe('on');
	});
});
