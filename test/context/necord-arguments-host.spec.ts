import { NecordArgumentsHost } from '../../src';
import { ArgumentsHost } from '@nestjs/common';

describe('NecordArgumentsHost', () => {
	let contextArg: unknown;
	let discoveryArg: unknown;
	let host: NecordArgumentsHost;

	beforeEach(() => {
		contextArg = { foo: 'bar' };
		discoveryArg = { provide: 'DiscoveryStub' } as any;
		host = new NecordArgumentsHost([contextArg, discoveryArg]);
	});

	const makeMockArgHost = () => {
		const args: any[] = [contextArg, discoveryArg];

		return {
			getArgs: <T>() => args as T,
			getArgByIndex: (index: number) => args[index],
			switchToHttp: () => ({}) as any,
			switchToRpc: () => ({}) as any,
			switchToWs: () => ({}) as any,
			getType: () => 'necord' as any
		} as ArgumentsHost;
	};

	it('should return context via getContext()', () => {
		expect(host.getContext()).toBe(contextArg);
	});

	it('should return discovery via getDiscovery()', () => {
		expect(host.getDiscovery()).toBe(discoveryArg);
	});

	it('create() should wrap an ArgumentsHost and preserve type', () => {
		const mockHost: ArgumentsHost = makeMockArgHost();
		const wrapped = NecordArgumentsHost.create(mockHost);

		expect(wrapped).toBeInstanceOf(NecordArgumentsHost);
		expect(wrapped.getType()).toBe('necord');
		expect(wrapped.getContext()).toBe(contextArg);
		expect(wrapped.getDiscovery()).toBe(discoveryArg);
	});

	it('getType() should return whatever type was set on the parent ExecutionContextHost', () => {
		const mockHost: ArgumentsHost = makeMockArgHost();
		mockHost.getType = () => 'http' as any;

		const wrapped = NecordArgumentsHost.create(mockHost);
		expect(wrapped.getType()).toBe('http');
	});

	it('getContext() should return the first argument by default', () => {
		const mockHost: ArgumentsHost = makeMockArgHost();

		const wrapped = NecordArgumentsHost.create(mockHost);
		expect(wrapped.getContext()).toBe(contextArg);
	});

	it('getDiscovery() should return the second argument by default', () => {
		const mockHost: ArgumentsHost = makeMockArgHost();

		const wrapped = NecordArgumentsHost.create(mockHost);
		expect(wrapped.getDiscovery()).toBe(discoveryArg);
	});
});
