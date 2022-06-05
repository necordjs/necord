import { Injectable, Type } from '@nestjs/common';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { BaseDiscovery } from './discovery';
import { Reflector } from '@nestjs/core';

@Injectable()
export class NecordExplorerService extends Reflector {
	public constructor(private readonly discoveryService: DiscoveryService) {
		super();
	}

	public explore<T, U extends BaseDiscovery>(
		key: string,
		clazz: Type<U>,
		fn: (discovery: U) => void
	) {
		return this.discoveryService
			.providerMethodsWithMetaAtKey<T>(key)
			.then(methods => methods.forEach(m => fn(new clazz(m))));
	}
}
