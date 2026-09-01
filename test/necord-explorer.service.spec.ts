import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Test, TestingModule } from '@nestjs/testing';

import { NecordBaseDiscovery, NecordExplorerService } from '../src/index.js';
import { NecordContextCreator } from '../src/necord-context.creator.js';

class MockNecordBaseDiscovery extends NecordBaseDiscovery {
	toJSON(): Record<string, any> {
		return { meta: this.meta };
	}
}

describe('NecordExplorerService', () => {
	let service: NecordExplorerService<MockNecordBaseDiscovery>;

	const testMethodMock = vi.fn<() => void>();
	const mockInstanceWrapper = {
		instance: {
			constructor: class TestClass {},
			testMethod: testMethodMock
		},
		isDependencyTreeStatic: vi.fn<() => boolean>().mockReturnValue(true),
		isTransient: false
	} as unknown as InstanceWrapper;

	const reflectorMock = {
		get: vi.fn<(...args: unknown[]) => unknown>()
	};

	const discoveryServiceMock = {
		getProviders: vi.fn<() => InstanceWrapper[]>()
	};

	const metadataScannerMock = {
		getAllMethodNames: vi.fn<() => string[]>()
	};

	const necordContextCreatorMock = {
		bind: vi.fn<(...args: unknown[]) => (() => void) | undefined>()
	};

	beforeEach(async () => {
		reflectorMock.get.mockReset();
		discoveryServiceMock.getProviders.mockReset().mockReturnValue([mockInstanceWrapper]);
		metadataScannerMock.getAllMethodNames.mockReset().mockReturnValue(['testMethod']);
		necordContextCreatorMock.bind.mockReset().mockReturnValue(vi.fn<() => void>());

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NecordExplorerService,
				{ provide: Reflector, useValue: reflectorMock },
				{ provide: DiscoveryService, useValue: discoveryServiceMock },
				{ provide: MetadataScanner, useValue: metadataScannerMock },
				{ provide: NecordContextCreator, useValue: necordContextCreatorMock }
			]
		}).compile();

		service = module.get<NecordExplorerService<MockNecordBaseDiscovery>>(NecordExplorerService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('explore', () => {
		it('should return an empty array when no items match the metadata key', () => {
			reflectorMock.get.mockReturnValue(null);

			const result = service.explore('test-metadata-key');

			expect(result).toEqual([]);
			expect(discoveryServiceMock.getProviders).toHaveBeenCalled();
			expect(metadataScannerMock.getAllMethodNames).toHaveBeenCalled();
			expect(reflectorMock.get).toHaveBeenCalled();
		});

		it('should return an array of discovery items when items match the metadata key', () => {
			const mockDiscoveryItem = new MockNecordBaseDiscovery('test-meta');
			reflectorMock.get.mockReturnValue(mockDiscoveryItem);

			const result = service.explore('test-metadata-key');

			expect(result).toHaveLength(1);
			expect(result[0]).toBe(mockDiscoveryItem);
			expect(discoveryServiceMock.getProviders).toHaveBeenCalled();
			expect(metadataScannerMock.getAllMethodNames).toHaveBeenCalled();
			expect(reflectorMock.get).toHaveBeenCalled();
			expect(result[0].getClass()).toBe(mockInstanceWrapper.instance.constructor);
			expect(result[0].getHandler()).toBe(testMethodMock);
		});

		it('should set discovery meta and context callback on discovery items', () => {
			const mockDiscoveryItem = new MockNecordBaseDiscovery('test-meta');
			const setDiscoveryMetaSpy = vi.spyOn(mockDiscoveryItem, 'setDiscoveryMeta');
			const setContextCallbackSpy = vi.spyOn(mockDiscoveryItem, 'setContextCallback');

			reflectorMock.get.mockReturnValue(mockDiscoveryItem);
			necordContextCreatorMock.bind.mockReturnValue(() =>
				Promise.resolve('context-callback-result')
			);

			const result = service.explore('test-metadata-key');

			expect(result).toHaveLength(1);
			expect(setDiscoveryMetaSpy).toHaveBeenCalledWith({
				class: mockInstanceWrapper.instance.constructor,
				handler: testMethodMock
			});
			expect(setContextCallbackSpy).toHaveBeenCalled();
			expect(necordContextCreatorMock.bind).toHaveBeenCalledWith(
				mockInstanceWrapper,
				'testMethod'
			);
		});

		it('should filter out providers without instances', () => {
			const emptyWrapper = { instance: null } as unknown as InstanceWrapper;
			discoveryServiceMock.getProviders.mockReturnValue([emptyWrapper]);

			const result = service.explore('test-metadata-key');

			expect(result).toEqual([]);
		});

		it('should filter out providers without prototypes', () => {
			const noPrototypeWrapper = {
				instance: Object.create(null)
			} as unknown as InstanceWrapper;

			discoveryServiceMock.getProviders.mockReturnValue([noPrototypeWrapper]);

			const result = service.explore('test-metadata-key');

			expect(result).toEqual([]);
		});
	});

	describe('flatMap', () => {
		it('should map and flatten results from callback', () => {
			const wrapper1 = { instance: { a: 1 } } as unknown as InstanceWrapper;
			const wrapper2 = { instance: { b: 2 } } as unknown as InstanceWrapper;

			(service as any).wrappers = [wrapper1, wrapper2];

			const callback = vi
				.fn<(wrapper: InstanceWrapper) => Array<string | null | undefined>>()
				.mockReturnValueOnce(['item1'])
				.mockReturnValueOnce(['item2', 'item3']);

			const result = (service as any).flatMap(callback);

			expect(result).toEqual(['item1', 'item2', 'item3']);
			expect(callback).toHaveBeenCalledTimes(2);
		});

		it('should filter out falsy results', () => {
			const wrapper1 = { instance: { a: 1 } } as unknown as InstanceWrapper;
			const wrapper2 = { instance: { b: 2 } } as unknown as InstanceWrapper;

			(service as any).wrappers = [wrapper1, wrapper2];

			const callback = vi
				.fn<(wrapper: InstanceWrapper) => Array<string | null | undefined>>()
				.mockReturnValueOnce([null, 'valid1'])
				.mockReturnValueOnce([undefined, 'valid2']);

			const result = (service as any).flatMap(callback);

			expect(result).toEqual(['valid1', 'valid2']);
		});
	});
});
