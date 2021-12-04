import { Injectable, OnModuleInit } from '@nestjs/common';
import { ListenerMetadata } from '../interfaces';
import { MetadataAccessorService } from './metadata-accessor.service';
import { NecordClient } from '../necord-client';
import { ExplorerService } from './explorer.service';

@Injectable()
export class ListenersService implements OnModuleInit {
	public constructor(
		private readonly explorerService: ExplorerService<ListenerMetadata>,
		private readonly metadataAccessor: MetadataAccessorService,
		private readonly client: NecordClient
	) {}

	public async onModuleInit() {
		const listeners = this.explorerService.explore((instance, prototype, name) =>
			this.metadataAccessor.getListenerMetadata(instance, name)
		);

		for (const listener of listeners) {
			this.client[listener.type](listener.event, (...args) => listener.execute(args));
		}
	}
}
