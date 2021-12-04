import { ExplorerService } from './explorer.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MetadataAccessorService } from './metadata-accessor.service';
import { NecordClient } from '../necord-client';
import { ComponentMetadata } from '../interfaces';
import { BaseMessageComponent, MessageComponentInteraction } from 'discord.js';

@Injectable()
export class ComponentsService implements OnModuleInit {
	private readonly components = new Map<string, BaseMessageComponent>();

	public constructor(
		private readonly explorerService: ExplorerService<ComponentMetadata>,
		private readonly metadataAccessor: MetadataAccessorService,
		private readonly client: NecordClient
	) {}

	public onModuleInit() {
		const components = this.explorerService.explore((instance, prototype, method) =>
			this.metadataAccessor.getMessageComponentMetadata(instance, method)
		);

		for (const component of components) {
			this.client.on(
				'interactionCreate',
				interaction =>
					interaction.isMessageComponent() &&
					interaction.componentType === MessageComponentInteraction.resolveType(component.type) &&
					interaction.customId === component.customId &&
					component.execute(interaction)
			);
		}
	}
}
