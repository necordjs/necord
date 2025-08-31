import { ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext } from '../../src';

class TestController {}

function testHandler() {
	return 'ok';
}

describe('NecordExecutionContext', () => {
	const arg0 = { foo: 'bar' };
	const arg1 = { provide: 'DiscoveryStub' } as any;
	const args = [arg0, arg1];

	function makeMockExecCtx(type: any): ExecutionContext {
		return {
			getArgByIndex: (index: number) => args[index],
			getArgs: () => args,
			getClass: () => TestController,
			getHandler: () => testHandler,
			switchToHttp: () => ({}) as any,
			switchToRpc: () => ({}) as any,
			switchToWs: () => ({}) as any,
			getType: () => type
		} as unknown as ExecutionContext;
	}

	it('create() should wrap an ExecutionContext and preserve args, class, handler, and type (necord)', () => {
		const mock = makeMockExecCtx('necord');
		const wrapped = NecordExecutionContext.create(mock);

		expect(wrapped).toBeInstanceOf(NecordExecutionContext);
		expect(wrapped.getType()).toBe('necord');
		expect(wrapped.getClass()).toBe(TestController);
		expect(wrapped.getHandler()).toBe(testHandler);
		// Inherits from NecordArgumentsHost
		expect(wrapped.getContext()).toBe(arg0);
		expect(wrapped.getDiscovery()).toBe(arg1);
	});

	it('getType() should reflect the underlying context type (http)', () => {
		const mock = makeMockExecCtx('http');
		const wrapped = NecordExecutionContext.create(mock);
		expect(wrapped.getType()).toBe('http');
	});
});
