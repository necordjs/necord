import { Injectable, Type } from '@nestjs/common';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { BaseDiscovery } from '../mixins';

@Injectable()
export class ExplorerService {
	public constructor(private readonly discoveryService: DiscoveryService) {}

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
