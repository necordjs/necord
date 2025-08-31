import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, firstValueFrom } from 'rxjs';
import { AutocompleteInteraction } from 'discord.js';
import { AutocompleteInterceptor, NecordExecutionContext } from '../../../../src';

class TestInterceptor extends AutocompleteInterceptor {
	public transformOptions = jest.fn();
}

describe('AutocompleteInterceptor', () => {
	let interceptor: TestInterceptor;

	// shared stubs
	let executionContext: ExecutionContext;
	let callHandler: CallHandler;

	// interaction & discovery stubs
	let interaction: Partial<AutocompleteInteraction> & { isAutocomplete: jest.Mock };
	let discovery: { isSlashCommand: jest.Mock };

	beforeEach(() => {
		jest.clearAllMocks();

		interceptor = new TestInterceptor();

		executionContext = {} as unknown as ExecutionContext;
		callHandler = {
			handle: jest.fn().mockReturnValue(of('next-value'))
		};

		interaction = {
			isAutocomplete: jest.fn()
		} as any;

		discovery = {
			isSlashCommand: jest.fn()
		};

		jest.spyOn(NecordExecutionContext, 'create').mockReturnValue({
			getContext: jest.fn().mockReturnValue([interaction]),
			getDiscovery: jest.fn().mockReturnValue(discovery)
		} as any);
	});

	it('should pass through to next.handle() when interaction is not autocomplete', async () => {
		interaction.isAutocomplete.mockReturnValue(false);
		discovery.isSlashCommand.mockReturnValue(true);

		const result$ = await interceptor.intercept(executionContext, callHandler);

		expect(NecordExecutionContext.create).toHaveBeenCalledWith(executionContext);
		expect(interaction.isAutocomplete).toHaveBeenCalledTimes(1);
		expect(discovery.isSlashCommand).not.toHaveBeenCalled(); // short-circuit
		expect(callHandler.handle).toHaveBeenCalledTimes(1);

		const value = await firstValueFrom(result$);
		expect(value).toBe('next-value');
		expect(interceptor.transformOptions).not.toHaveBeenCalled();
	});

	it('should pass through to next.handle() when discovery is not slash command', async () => {
		interaction.isAutocomplete.mockReturnValue(true);
		discovery.isSlashCommand.mockReturnValue(false);

		const result$ = await interceptor.intercept(executionContext, callHandler);

		expect(NecordExecutionContext.create).toHaveBeenCalledWith(executionContext);
		expect(interaction.isAutocomplete).toHaveBeenCalledTimes(1);
		expect(discovery.isSlashCommand).toHaveBeenCalledTimes(1);
		expect(callHandler.handle).toHaveBeenCalledTimes(1);

		const value = await firstValueFrom(result$);
		expect(value).toBe('next-value');
		expect(interceptor.transformOptions).not.toHaveBeenCalled();
	});

	it('should call transformOptions and NOT call next.handle() when both conditions are true (sync transform)', async () => {
		interaction.isAutocomplete.mockReturnValue(true);
		discovery.isSlashCommand.mockReturnValue(true);
		interceptor.transformOptions.mockReturnValue(undefined);

		const result$ = await interceptor.intercept(executionContext, callHandler);

		expect(callHandler.handle).not.toHaveBeenCalled();
		expect(interceptor.transformOptions).toHaveBeenCalledTimes(1);
		expect(interceptor.transformOptions).toHaveBeenCalledWith(interaction);

		// The interceptor wraps the return value in `of(...)`
		const value = await firstValueFrom(result$);
		expect(value).toBeUndefined();
	});

	it('should call transformOptions and emit a Promise when transformOptions is async', async () => {
		interaction.isAutocomplete.mockReturnValue(true);
		discovery.isSlashCommand.mockReturnValue(true);
		interceptor.transformOptions.mockResolvedValue(undefined);

		const result$ = await interceptor.intercept(executionContext, callHandler);

		expect(callHandler.handle).not.toHaveBeenCalled();
		expect(interceptor.transformOptions).toHaveBeenCalledWith(interaction);

		// Because `of(this.transformOptions(...))` emits the Promise itself,
		// the observable value is the Promise<void>
		const emitted = firstValueFrom(result$);
		expect(emitted).toBeInstanceOf(Promise);

		// Optionally assert that the emitted promise resolves
		await expect(emitted).resolves.toBeUndefined();
	});
});
