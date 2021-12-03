import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { ListenerMetadata } from '../interfaces';
import { MetadataAccessorService } from './metadata-accessor.service';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { NecordClient } from '../necord-client';
import { BaseExplorerService } from './base-explorer.service';

@Injectable()
export class ListenersExplorerService extends BaseExplorerService<ListenerMetadata> {
	public constructor(
		protected readonly externalContextCreator: ExternalContextCreator,
		protected readonly discoveryService: DiscoveryService,
		private readonly metadataScanner: MetadataScanner,
		private readonly metadataAccessor: MetadataAccessorService,
		private readonly client: NecordClient
	) {
		super(externalContextCreator, discoveryService);
	}

	protected filter(instance: Record<string, any>, prototype: object): ListenerMetadata[] {
		return this.metadataScanner.scanFromPrototype(instance, prototype, method => {
			const metadata = this.metadataAccessor.getListenerMetadata(instance, method);

			if (!metadata) return;

			return {
				...metadata,
				instance,
				prototype,
				method
			};
		});
	}

	protected register(listeners: ListenerMetadata[]) {
		for (const listener of listeners) {
			const execute = this.createContextCallback(listener.instance, listener.prototype, listener.method);
			this.client[listener.once ? 'once' : 'on'](listener.event, (...args) => execute(args));
			this.logger.log(`Registered new listener for event "${listener.event}"`);
		}
	}
}
