import { BaseExplorerService } from './base-explorer.service';
import { Injectable } from '@nestjs/common';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { MetadataAccessorService } from './metadata-accessor.service';
import { NecordClient } from '../necord-client';
import { ComponentMetadata } from '../interfaces/component-metadata.interface';
import { MessageComponentTypes } from 'discord.js/typings/enums';
import { MessageComponentInteraction } from 'discord.js';

@Injectable()
export class ComponentsExplorerService extends BaseExplorerService<ComponentMetadata> {
	public constructor(
		protected readonly externalContextCreator: ExternalContextCreator,
		protected readonly discoveryService: DiscoveryService,
		private readonly metadataScanner: MetadataScanner,
		private readonly metadataAccessor: MetadataAccessorService,
		private readonly client: NecordClient
	) {
		super(externalContextCreator, discoveryService);
	}

	protected filter(instance: Record<string, any>, prototype: object): ComponentMetadata[] {
		return this.metadataScanner.scanFromPrototype(instance, prototype, method => {
			const metadata = this.metadataAccessor.getMessageComponentMetadata(instance, method);

			if (!metadata) return;

			return {
				...metadata,
				instance,
				prototype,
				method
			};
		});
	}

	protected register(components: ComponentMetadata[]): void {
		for (const component of components) {
			const execute = this.createContextCallback(component.instance, component.prototype, component.method);
			this.client.on(
				'interactionCreate',
				interaction =>
					interaction.isMessageComponent() &&
					interaction.componentType === MessageComponentInteraction.resolveType(component.type) &&
					interaction.customId === component.customId &&
					execute(interaction)
			);
		}
	}
}
