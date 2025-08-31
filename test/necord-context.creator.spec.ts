import { Test, TestingModule } from '@nestjs/testing';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { ContextId, ModuleRef } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { NecordContextCreator } from '../src/necord-context.creator';
import {
	ASYNC_CONTEXT_ATTRIBUTE,
	AsyncContext,
	NecordParamsFactory,
	NecordParamType
} from '../src';

describe('NecordContextCreator', () => {
	let contextCreator: NecordContextCreator;
	let externalContextCreator: ExternalContextCreator;

	class TestClass {
		testMethod() {
			return 'test-result';
		}
	}

	const mockInstance = new TestClass();
	const mockModuleRef = {
		registerRequestByContextId: jest.fn(),
		resolve: jest.fn().mockResolvedValue(new TestClass())
	} as unknown as ModuleRef;

	const mockContextId = {
		id: 'test-context-id'
	} as unknown as ContextId;

	const mockHost = {
		getProviderByKey: jest.fn()
	};
	mockHost.getProviderByKey.mockReturnValue({ instance: mockModuleRef });

	const mockInstanceWrapper = {
		instance: mockInstance,
		metatype: TestClass,
		id: 'test-wrapper-id',
		isDependencyTreeStatic: jest.fn().mockReturnValue(true),
		isTransient: false,
		host: mockHost
	} as unknown as InstanceWrapper;

	beforeEach(async () => {
		const externalContextCreatorMock = {
			create: jest.fn().mockReturnValue(() => 'context-result')
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NecordContextCreator,
				{ provide: ExternalContextCreator, useValue: externalContextCreatorMock }
			]
		}).compile();

		contextCreator = module.get<NecordContextCreator>(NecordContextCreator);
		externalContextCreator = module.get<ExternalContextCreator>(ExternalContextCreator);
	});

	it('should be defined', () => {
		expect(contextCreator).toBeDefined();
	});

	describe('bind', () => {
		it('should create a context callback directly for static dependencies', async () => {
			mockInstanceWrapper.isDependencyTreeStatic = jest.fn().mockReturnValue(true);
			const createContextCallbackSpy = jest.spyOn(
				contextCreator as any,
				'createContextCallback'
			);

			const callback = contextCreator.bind(mockInstanceWrapper, 'testMethod');
			const result = await callback('test-arg');

			expect(createContextCallbackSpy).toHaveBeenCalledWith(mockInstance, 'testMethod');
			expect(result).toBe('context-result');
			expect(externalContextCreator.create).toHaveBeenCalled();
		});

		describe('when request-scoped dependencies are used', () => {
			let mockNecordContext: object;

			beforeEach(async () => {
				mockNecordContext = {};
				mockInstanceWrapper.isDependencyTreeStatic = jest.fn().mockReturnValue(false);
				NecordParamsFactory.prototype.exchangeKeyForValue = jest
					.fn()
					.mockImplementation((paramType, data, args) => {
						if (paramType === NecordParamType.CONTEXT) {
							return mockNecordContext;
						}
						return null;
					});
			});

			it('should create a context callback for request-scoped dependencies', async () => {
				const callback = contextCreator.bind(mockInstanceWrapper, 'testMethod');
				const result = await callback('test-arg');

				expect(mockModuleRef.registerRequestByContextId).toHaveBeenCalled();
				expect(mockModuleRef.resolve).toHaveBeenCalled();
				expect(externalContextCreator.create).toHaveBeenCalled();
				expect(result).toBe('context-result');
			});

			it('should attach the async context to the request-scoped instance', async () => {
				const attachToSpy = jest.spyOn(AsyncContext.prototype, 'attachTo');

				const callback = contextCreator.bind(mockInstanceWrapper, 'testMethod');
				await callback('test-arg');

				expect(attachToSpy).toHaveBeenCalled();
			});

			it('should handle cases where the async context is already attached', async () => {
				mockNecordContext[ASYNC_CONTEXT_ATTRIBUTE] = new AsyncContext();

				const callback = contextCreator.bind(mockInstanceWrapper, 'testMethod');
				const result = await callback('test-arg');

				expect(mockModuleRef.registerRequestByContextId).not.toHaveBeenCalled();
				expect(mockModuleRef.resolve).toHaveBeenCalled();
				expect(externalContextCreator.create).toHaveBeenCalled();
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

			expect(externalContextCreator.create).toHaveBeenCalledWith(
				mockInstance,
				mockInstance.testMethod,
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
		jest.clearAllMocks();
	});
});
