import type { Mock, MockInstance } from 'vitest';

import { AutocompleteInteraction } from 'discord.js';
import { ExecutionContext } from '@nestjs/common';
import { of, firstValueFrom } from 'rxjs';

import { AutocompleteInterceptor, NecordExecutionContext } from '../../../../src/index.js';

class TestInterceptor extends AutocompleteInterceptor {
	public transformOptions = vi.fn<(...args: any[]) => any>();
}

describe('AutocompleteInterceptor', () => {
	let interceptor: TestInterceptor;
	let createContextSpy: MockInstance<typeof NecordExecutionContext.create>;

	// shared stubs
	let executionContext: ExecutionContext;
	let callHandler: { handle: Mock };

	// interaction & discovery stubs
	let interaction: { isAutocomplete: Mock } & Partial<AutocompleteInteraction>;
	let discovery: { isSlashCommand: Mock };

	beforeEach(() => {
		vi.clearAllMocks();

		interceptor = new TestInterceptor();

		executionContext = {} as unknown as ExecutionContext;
		callHandler = {
			handle: vi.fn<(...args: any[]) => any>().mockReturnValue(of('next-value'))
		};

		interaction = {
			isAutocomplete: vi.fn<(...args: any[]) => any>()
		} as any;

		discovery = {
			isSlashCommand: vi.fn<(...args: any[]) => any>()
		};

		createContextSpy = vi.spyOn(NecordExecutionContext, 'create').mockReturnValue({
			getContext: vi.fn<(...args: any[]) => any>().mockReturnValue([interaction]),
			getDiscovery: vi.fn<(...args: any[]) => any>().mockReturnValue(discovery)
		} as any);
	});

	it('should pass through to next.handle() when interaction is not autocomplete', async () => {
		interaction.isAutocomplete.mockReturnValue(false);
		discovery.isSlashCommand.mockReturnValue(true);

		const result$ = await interceptor.intercept(executionContext, callHandler);

		expect(createContextSpy).toHaveBeenCalledWith(executionContext);
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

		expect(createContextSpy).toHaveBeenCalledWith(executionContext);
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
