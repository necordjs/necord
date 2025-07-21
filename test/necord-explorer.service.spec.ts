import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { NecordBaseDiscovery, NecordExplorerService } from '../src';
import { NecordContextCreator } from '../src/necord-context.creator';

class MockNecordBaseDiscovery extends NecordBaseDiscovery {
	toJSON(): Record<string, any> {
		return { meta: this.meta };
	}
}

describe('NecordExplorerService', () => {
	let service: NecordExplorerService<MockNecordBaseDiscovery>;
	let reflector: Reflector;
	let discoveryService: DiscoveryService;
	let metadataScanner: MetadataScanner;
	let necordContextCreator: NecordContextCreator;

	const mockInstanceWrapper = {
		instance: {
			constructor: class TestClass {},
			testMethod: jest.fn()
		},
		isDependencyTreeStatic: jest.fn().mockReturnValue(true),
		isTransient: false
	} as unknown as InstanceWrapper;

	beforeEach(async () => {
		const reflectorMock = {
			get: jest.fn()
		};

		const discoveryServiceMock = {
			getProviders: jest.fn().mockReturnValue([mockInstanceWrapper])
		};

		const metadataScannerMock = {
			getAllMethodNames: jest.fn().mockReturnValue(['testMethod'])
		};

		const necordContextCreatorMock = {
			bind: jest.fn().mockReturnValue(jest.fn())
		};

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
		reflector = module.get(Reflector);
		discoveryService = module.get(DiscoveryService);
		metadataScanner = module.get(MetadataScanner);
		necordContextCreator = module.get(NecordContextCreator);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('explore', () => {
		it('should return an empty array when no items match the metadata key', () => {
			reflector.get = jest.fn().mockReturnValue(null);

			const result = service.explore('test-metadata-key');

			expect(result).toEqual([]);
			expect(discoveryService.getProviders).toHaveBeenCalled();
			expect(metadataScanner.getAllMethodNames).toHaveBeenCalled();
			expect(reflector.get).toHaveBeenCalled();
		});

		it('should return an array of discovery items when items match the metadata key', () => {
			const mockDiscoveryItem = new MockNecordBaseDiscovery('test-meta');
			reflector.get = jest.fn().mockReturnValue(mockDiscoveryItem);

			const result = service.explore('test-metadata-key');

			expect(result).toHaveLength(1);
			expect(result[0]).toBe(mockDiscoveryItem);
			expect(discoveryService.getProviders).toHaveBeenCalled();
			expect(metadataScanner.getAllMethodNames).toHaveBeenCalled();
			expect(reflector.get).toHaveBeenCalled();
			expect(result[0].getClass()).toBe(mockInstanceWrapper.instance.constructor);
			expect(result[0].getHandler()).toBe(mockInstanceWrapper.instance.testMethod);
		});

		it('should set discovery meta and context callback on discovery items', () => {
			const mockDiscoveryItem = new MockNecordBaseDiscovery('test-meta');
			const setDiscoveryMetaSpy = jest.spyOn(mockDiscoveryItem, 'setDiscoveryMeta');
			const setContextCallbackSpy = jest.spyOn(mockDiscoveryItem, 'setContextCallback');

			reflector.get = jest.fn().mockReturnValue(mockDiscoveryItem);
			necordContextCreator.bind = jest.fn().mockReturnValue(() => 'context-callback-result');

			const result = service.explore('test-metadata-key');

			expect(result).toHaveLength(1);
			expect(setDiscoveryMetaSpy).toHaveBeenCalledWith({
				class: mockInstanceWrapper.instance.constructor,
				handler: mockInstanceWrapper.instance.testMethod
			});
			expect(setContextCallbackSpy).toHaveBeenCalled();
			expect(necordContextCreator.bind).toHaveBeenCalledWith(
				mockInstanceWrapper,
				'testMethod'
			);
		});

		it('should filter out providers without instances', () => {
			const emptyWrapper = { instance: null } as unknown as InstanceWrapper;
			discoveryService.getProviders = jest.fn().mockReturnValue([emptyWrapper]);

			const result = service.explore('test-metadata-key');

			expect(result).toEqual([]);
		});

		it('should filter out providers without prototypes', () => {
			const noPrototypeWrapper = {
				instance: Object.create(null)
			} as unknown as InstanceWrapper;

			discoveryService.getProviders = jest.fn().mockReturnValue([noPrototypeWrapper]);

			const result = service.explore('test-metadata-key');

			expect(result).toEqual([]);
		});
	});

	describe('flatMap', () => {
		it('should map and flatten results from callback', () => {
			const wrapper1 = { instance: { a: 1 } } as unknown as InstanceWrapper;
			const wrapper2 = { instance: { b: 2 } } as unknown as InstanceWrapper;

			(service as any).wrappers = [wrapper1, wrapper2];

			const callback = jest
				.fn()
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

			const callback = jest
				.fn()
				.mockReturnValueOnce([null, 'valid1'])
				.mockReturnValueOnce([undefined, 'valid2']);

			const result = (service as any).flatMap(callback);

			expect(result).toEqual(['valid1', 'valid2']);
		});
	});
});
