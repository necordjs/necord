import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { ContextId, ModuleRef } from '@nestjs/core';

import {
	ASYNC_CONTEXT_ATTRIBUTE,
	AsyncContext,
	NecordParamsFactory,
	NecordParamType
} from '../src/index.js';
import { NecordContextCreator } from '../src/necord-context.creator.js';

describe('NecordContextCreator', () => {
	let contextCreator: NecordContextCreator;

	class TestClass {
		testMethod() {
			return 'test-result';
		}
	}

	const testMethodSpy = vi.spyOn(TestClass.prototype, 'testMethod');
	const mockInstance = new TestClass();
	const mockModuleRef = {
		registerRequestByContextId: vi.fn<(request: object, contextId: ContextId) => void>(),
		resolve: vi.fn<() => Promise<TestClass>>().mockResolvedValue(new TestClass())
	};

	const mockHost = {
		getProviderByKey: vi.fn<() => { instance: ModuleRef }>()
	};
	mockHost.getProviderByKey.mockReturnValue({
		instance: mockModuleRef as unknown as ModuleRef
	});

	const externalContextCreatorMock = {
		create: vi.fn<() => () => string>()
	};

	const mockInstanceWrapper = {
		instance: mockInstance,
		metatype: TestClass,
		id: 'test-wrapper-id',
		isDependencyTreeStatic: vi.fn<() => boolean>().mockReturnValue(true),
		isTransient: false,
		host: mockHost
	} as unknown as InstanceWrapper;

	beforeEach(async () => {
		externalContextCreatorMock.create.mockReturnValue(() => 'context-result');

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NecordContextCreator,
				{ provide: ExternalContextCreator, useValue: externalContextCreatorMock }
			]
		}).compile();

		contextCreator = module.get<NecordContextCreator>(NecordContextCreator);
	});

	it('should be defined', () => {
		expect(contextCreator).toBeDefined();
	});

	describe('bind', () => {
		it('should create a context callback directly for static dependencies', async () => {
			mockInstanceWrapper.isDependencyTreeStatic = vi
				.fn<() => boolean>()
				.mockReturnValue(true);
			const createContextCallbackSpy = vi.spyOn(
				contextCreator as any,
				'createContextCallback'
			);

			const callback = contextCreator.bind(mockInstanceWrapper, 'testMethod');
			if (!callback) throw new Error('Expected a callback for the existing test method.');
			const result = await callback('test-arg');

			expect(createContextCallbackSpy).toHaveBeenCalledWith(mockInstance, 'testMethod');
			expect(result).toBe('context-result');
			expect(externalContextCreatorMock.create).toHaveBeenCalled();
		});

		describe('when request-scoped dependencies are used', () => {
			let mockNecordContext: object;

			beforeEach(async () => {
				mockNecordContext = {};
				mockInstanceWrapper.isDependencyTreeStatic = vi
					.fn<() => boolean>()
					.mockReturnValue(false);
				NecordParamsFactory.prototype.exchangeKeyForValue = vi
					.fn<NecordParamsFactory['exchangeKeyForValue']>()
					.mockImplementation(paramType => {
						if (paramType === NecordParamType.CONTEXT) {
							return mockNecordContext;
						}
						return null;
					});
			});

			it('should create a context callback for request-scoped dependencies', async () => {
				const callback = contextCreator.bind(mockInstanceWrapper, 'testMethod');
				if (!callback) throw new Error('Expected a callback for the existing test method.');
				const result = await callback('test-arg');

				expect(mockModuleRef.registerRequestByContextId).toHaveBeenCalled();
				expect(mockModuleRef.resolve).toHaveBeenCalled();
				expect(externalContextCreatorMock.create).toHaveBeenCalled();
				expect(result).toBe('context-result');
			});

			it('should attach the async context to the request-scoped instance', async () => {
				const attachToSpy = vi.spyOn(AsyncContext.prototype, 'attachTo');

				const callback = contextCreator.bind(mockInstanceWrapper, 'testMethod');
				if (!callback) throw new Error('Expected a callback for the existing test method.');
				await callback('test-arg');

				expect(attachToSpy).toHaveBeenCalled();
			});

			it('should handle cases where the async context is already attached', async () => {
				mockNecordContext[ASYNC_CONTEXT_ATTRIBUTE] = new AsyncContext();

				const callback = contextCreator.bind(mockInstanceWrapper, 'testMethod');
				if (!callback) throw new Error('Expected a callback for the existing test method.');
				const result = await callback('test-arg');

				expect(mockModuleRef.registerRequestByContextId).not.toHaveBeenCalled();
				expect(mockModuleRef.resolve).toHaveBeenCalled();
				expect(externalContextCreatorMock.create).toHaveBeenCalled();
				expect(result).toBe('context-result');
			});
		});
	});

	describe('createContextCallback', () => {
		it('should return undefined if instance, prototype, or method is missing', () => {
			let result = (contextCreator as any).createContextCallback(null, 'testMethod');
			expect(result).toBeUndefined();

			const instanceWithoutPrototype = Object.create(null);
			result = (contextCreator as any).createContextCallback(
				instanceWithoutPrototype,
				'testMethod'
			);
			expect(result).toBeUndefined();

			result = (contextCreator as any).createContextCallback(
				mockInstance,
				'nonExistentMethod'
			);
			expect(result).toBeUndefined();
		});

		it('should create a context callback using externalContextCreator', () => {
			(contextCreator as any).createContextCallback(mockInstance, 'testMethod');

			expect(externalContextCreatorMock.create).toHaveBeenCalledWith(
				mockInstance,
				testMethodSpy,
				'testMethod',
				ROUTE_ARGS_METADATA,
				expect.any(NecordParamsFactory),
				STATIC_CONTEXT,
				undefined,
				{ guards: true, filters: true, interceptors: true },
				'necord'
			);
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});
});
